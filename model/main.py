from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi import Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import cv2
import pandas as pd
import numpy as np
import os
import io
import tempfile
from ultralytics import YOLO
from PIL import Image
import tensorflow as tf
from datetime import datetime
import torch
from uuid import uuid4
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import json
import prophet
import matplotlib.pyplot as plt

# Patch for Windows compatibility
def patch_ultralytics_safe_run():
    import ultralytics.utils.downloads

    def safe_run_windows(path):
        temp_path = os.path.join(tempfile.gettempdir(), 'ultralytics_runner')
        os.makedirs(temp_path, exist_ok=True)
        return temp_path

    ultralytics.utils.downloads.safe_run = safe_run_windows

patch_ultralytics_safe_run()

# Initialize FastAPI app
app = FastAPI()

load_dotenv()
genai.configure(api_key=os.getenv("AIzaSyD337AxVdUTFizTaXJBPd9q7gcoJ2DOQNE"))


def get_pdf_text(pdf_files):
    text = ""
    for pdf in pdf_files:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=50000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context. If the answer is not in the provided context, say, "Answer is not available in the context." Do not provide incorrect answers. If they ask in Tamil, reply in Tamil; if they ask in English, reply in English.

    Context:
    {context}?

    Question:
    {question}

    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

def handle_user_input(user_question):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(user_question)

    chain = get_conversational_chain()
    response = chain({"input_documents": docs, "question": user_question}, return_only_outputs=True)
    return response["output_text"]

# CORS Middleware
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory for annotated images
ANNOTATED_IMAGES_DIR = "annotated_images"
os.makedirs(ANNOTATED_IMAGES_DIR, exist_ok=True)

# Mount static directory to serve images
app.mount("/static", StaticFiles(directory=ANNOTATED_IMAGES_DIR), name="static")
# Define room attributes


# Load YOLOv8 model
MODEL_PATH = "best.pt"
model = YOLO(MODEL_PATH)

# Load TensorFlow model for messy prediction
model_messy = tf.keras.models.load_model('messycleanmodel.h5')

# Load YOLOv5 model for carbon-related detection
carbon_model = torch.hub.load('ultralytics/yolov5', 'yolov5s', force_reload=True, trust_repo=True)

# Object classes and probability threshold for carbon model
object_classes = ['car', 'motorcycle']
prob_threshold = 0.2

# Define room attributes
room_attributes = {
    "small": {"room_type": "working room", "room_occupancy": "medium", "room_kwh": 0.1},
    "medium": {"room_type": "storage room", "room_occupancy": "small", "room_kwh": 0.05},
    "large": {"room_type": "break room", "room_occupancy": "large", "room_kwh": 0.2},
}

def generate_dataset():
    num_days = 30  # Number of days in the month
    efficiency_threshold = 85  # Threshold below which maintenance is needed
    panel_area = 10  # Area of the panel in square meters (m²)
    fixed_daylight_hours = 8  # Fixed daylight hours (8 hours)
    initial_efficiency = 95  # Initial efficiency at the start of the month

    np.random.seed(42)  # For reproducibility
    temperatures = np.random.uniform(20, 40, num_days)
    solar_intensity = np.random.uniform(800, 1200, num_days)

    efficiency_degradation_rate = 0.5  # Decrease in efficiency per day
    panel_efficiency = initial_efficiency - np.arange(num_days) * efficiency_degradation_rate
    panel_efficiency = np.clip(panel_efficiency, 70, 100)

    daylight_hours = np.full(num_days, fixed_daylight_hours)

    energy_generated = (
        (solar_intensity * panel_area * panel_efficiency / 100) * daylight_hours / 1000
    )

    maintenance_due = (panel_efficiency < efficiency_threshold).astype(int)

    carbon_offset = energy_generated * 0.92

    grid_cost_per_kWh = 10
    solar_cost_per_kWh = 4

    cost_savings = (energy_generated * grid_cost_per_kWh) - (energy_generated * solar_cost_per_kWh)

    data = pd.DataFrame({
        "day": np.arange(1, num_days + 1),
        "temperature": temperatures,
        "solar_intensity": solar_intensity,
        "panel_efficiency": panel_efficiency,
        "daylight_hours": daylight_hours,
        "energy_generated_kWh": energy_generated,
        "carbon_offset_kg_CO2": carbon_offset,
        "maintenance_due": maintenance_due,
        "maintenance_recommendation": np.where(
            maintenance_due == 1, "Maintenance Needed: Efficiency below threshold", "No Maintenance Needed"
        ),
        "cost_savings_INR": cost_savings,
    })
    return data

# Generate dataset on startup
data = generate_dataset()

data_csv_path = "data.csv"
data.to_csv(data_csv_path, index=False)

def is_light_on(frame, threshold=120):
    """
    Determine if the light is on in a given frame based on average brightness.
    
    Args:
        frame (numpy.ndarray): Input image frame
        threshold (int): Brightness threshold to determine light status
    
    Returns:
        bool: True if light is on, False otherwise
    """
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    avg_brightness = np.mean(gray_frame)
    return avg_brightness > threshold

def preprocess_image(img: Image.Image, size: tuple = (150, 150)):
    """
    Preprocess image for messy prediction model.
    
    Args:
        img (Image.Image): Input image
        size (tuple): Target image size
    
    Returns:
        numpy.ndarray: Preprocessed image array
    """
    img = img.resize(size)
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img

@app.get("/")
async def root():
    """
    Root endpoint providing API information.
    """
    return {
        "message": "Integrated API for Waste Detection, Room Monitoring, and Carbon Object Detection",
        "endpoints": [
            "/detect",
            "/download/{filename}",
            "/messy_predict",
            "/process_video",
            "/carbon"
        ]
    }

@app.post("/detect")
async def detect_objects(file: UploadFile = File(...)):
    """
    Detect and count objects in an uploaded image using YOLOv8.
    """
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        results = model(image_np)
        result = results[0]
        annotated_image = result.plot()

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        annotated_image_path = os.path.join(ANNOTATED_IMAGES_DIR, f"annotated_{timestamp}.jpg")
        cv2.imwrite(annotated_image_path, annotated_image)

        counts = {}
        for box in result.boxes:
            cls_id = int(box.cls)
            cls_name = model.names[cls_id]
            counts[cls_name] = counts.get(cls_name, 0) + 1

        annotated_image_url = f"/static/{os.path.basename(annotated_image_path)}"
        return {"annotated_image_url": annotated_image_url, "counts": counts}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/carbon")
async def carbon_detection(file: UploadFile = File(...)):
    """
    Detect carbon-related objects (e.g., cars, motorcycles) in an uploaded image using YOLOv5.
    """
    try:
        # Read image file
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_np = np.array(image)

        # Perform inference
        results = carbon_model(img_np)

        # Count objects and annotate the image
        object_counts = {obj_class: 0 for obj_class in object_classes}
        img_cv = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

        for detection in results.pred[0]:
            prob = detection[4].item()  # Probability of detection
            if prob >= prob_threshold:
                obj_class = results.names[int(detection[-1])]
                if obj_class in object_classes:
                    object_counts[obj_class] += 1

                    # Get bounding box coordinates
                    x1, y1, x2, y2 = map(int, detection[:4])  # Convert to integer

                    # Draw bounding box and label on the image
                    cv2.rectangle(img_cv, (x1, y1), (x2, y2), (255, 0, 0), 2)
                    cv2.putText(img_cv, f'{obj_class} {prob:.2f}', (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

        # Generate unique filename for the annotated image
        filename = f"{uuid4().hex}.jpg"
        output_path = os.path.join(ANNOTATED_IMAGES_DIR, filename)
        cv2.imwrite(output_path, img_cv)

        # Return object counts and link to the annotated image
        image_url = f"/static/{filename}"
        return {"object_counts": object_counts, "annotated_image_url": image_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in carbon detection: {e}")

@app.post("/messy_predict")
async def predict_messy(file: UploadFile = File(...)):
    """
    Predict messiness score for an uploaded image.
    """
    try:
        image_bytes = await file.read()
        img = Image.open(io.BytesIO(image_bytes))

        img_array = preprocess_image(img)
        prediction = model_messy.predict(img_array)
        messy_score = float(prediction[0][0])
        return {"result": messy_score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in messy prediction: {e}")

@app.post("/process_video")
async def process_video(room_id: str, file: UploadFile = File(...)):
    """
    Process video to analyze room light usage and energy efficiency.
    
    Args:
        room_id (str): Identifier for the room being analyzed
        file (UploadFile): Uploaded video file
    
    Returns:
        dict: Room light usage and energy efficiency analysis
    """
    try:
        # Check if room information exists for the provided room_id
        if room_id not in room_attributes:
            raise HTTPException(status_code=400, detail="Room information not found.")
        
        # Read the uploaded video file
        video_bytes = await file.read()
        video_path = f"temp_{file.filename}"

        # Save the uploaded video to a temporary file
        with open(video_path, "wb") as f:
            f.write(video_bytes)

        # Initialize video processing variables
        log_data = []
        light_on = False
        start_time = None
        total_duration = 0
        fps = 0

        room_info = room_attributes.get(room_id, {})
        if not room_info:
            raise HTTPException(status_code=400, detail="Room information not found.")

        room_type = room_info.get("room_type", "unknown")
        room_occupancy = room_info.get("room_occupancy", "unknown")
        room_kwh = room_info.get("room_kwh", 0)

        # Read video and process frame by frame
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise HTTPException(status_code=500, detail="Error: Unable to open video file.")
        
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        frame_count = 0

        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                frame_count += 1
                timestamp = frame_count / fps

                current_light_status = is_light_on(frame)

                if current_light_status != light_on:
                    if current_light_status:
                        start_time = timestamp
                    else:
                        if start_time is not None:
                            duration = timestamp - start_time
                            total_duration += duration
                        start_time = None
                    light_on = current_light_status

        finally:
            cap.release()
            cv2.destroyAllWindows()

        # Calculate energy usage and efficiency status
        total_energy = (total_duration / 3600) * room_kwh
        threshold = 8 * room_kwh
        efficiency_status = "Inefficient" if total_energy > threshold else "Efficient"

        log_data.append([room_id, room_type, room_occupancy, total_duration, total_energy, threshold, efficiency_status])

        # Prepare and return results as a dictionary
        result = {
            "room_id": room_id,
            "room_type": room_type,
            "room_occupancy": room_occupancy,
            "total_duration_seconds": total_duration,
            "total_energy_kWh": total_energy,
            "threshold_kWh": threshold,
            "efficiency_status": efficiency_status
        }

        # Optionally, save results to a CSV file
        df = pd.DataFrame(log_data, columns=[
            "Room_ID", "Room_Type", "Room_Occupancy", "Total_Duration_Seconds",
            "Total_Energy_kWh", "Threshold_kWh", "Efficiency_Status"
        ])
        df.to_csv(f"room_light_usage_summary_{room_id}.csv", index=False)

        # Clean up temporary video file
        os.remove(video_path)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {e}")
    
@app.get("/download/{filename}")
async def download_image(filename: str):
    """
    Download an annotated image by filename.
    """
    file_path = os.path.join(ANNOTATED_IMAGES_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/jpeg", filename=filename)
    else:
        raise HTTPException(status_code=404, detail="File not found")

# Optional: Add startup event to validate model loading

@app.get("/data")
def get_data():
    """Return the dataset as JSON."""
    return data.to_dict(orient="records")

@app.get("/data/{day}")
def get_day_data(day: int):
    """Get data for a specific day."""
    if day < 1 or day > len(data):
        raise HTTPException(status_code=404, detail="Day out of range")
    day_data = data[data["day"] == day]
    return day_data.to_dict(orient="records")

@app.get("/download")
def download_csv():
    """Download the dataset as a CSV file."""
    return FileResponse(data_csv_path, media_type="text/csv", filename="data.csv")

@app.get("/analytics/maintenance_due")
def maintenance_due():
    """Get all records where maintenance is due."""
    maintenance_data = data[data["maintenance_due"] == 1]
    return maintenance_data.to_dict(orient="records")

@app.get("/analytics/total_savings")
def total_savings():
    """Calculate the total cost savings for the month."""
    total = data["cost_savings_INR"].sum()
    return {"total_savings_INR": total}



@app.post("/upload")
async def upload_pdfs(files: list[UploadFile]):
    pdf_files = [io.BytesIO(await file.read()) for file in files]
    raw_text = get_pdf_text(pdf_files)
    text_chunks = get_text_chunks(raw_text)
    get_vector_store(text_chunks)
    return {"message": "PDFs processed successfully. You can now ask questions."}

# add Content-Type: application/x-www-form-urlencoded and form data with key question
@app.post("/ask")
async def ask_question(question: str = Form(...)):
    if not question:
        return JSONResponse(content={"error": "Question is required."}, status_code=400)

    try:
        response = handle_user_input(question)
        return {"question": question, "response": response}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Chatbot API is running."}



@app.get("/forecast")
async def create_forecast(file_path: str = "C:/Users/nayak/Downloads/extended_energy_data.csv"):
    try:
        # Verify file exists
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"File not found at {file_path}")
        
        # Read the CSV file
        data = pd.read_csv(file_path)
        
        # Data preprocessing
        data['timestamp'] = pd.to_datetime(data['timestamp'])
        data = data.sort_values('timestamp')
        data['energyKWh'] = data['energyKWh'].fillna(data['energyKWh'].mean())
        
        # Prepare data for Prophet
        prophet_data = data[['timestamp', 'energyKWh']].rename(columns={'timestamp': 'ds', 'energyKWh': 'y'})
        
        # Split data
        train_size = int(0.8 * len(prophet_data))
        train = prophet_data[:train_size]
        test = prophet_data[train_size:]
        
        # Create and fit Prophet model
        model = prophet.Prophet(
            seasonality_mode='additive',
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=True
        )
        model.fit(train)
        
        # Generate forecast
        future = model.make_future_dataframe(periods=len(test), freq='D')
        forecast = model.predict(future)
        
        # Prepare forecast results
        forecast_results = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(len(test))
        
        # Plot and save forecast
        plt.figure(figsize=(12, 6))
        plt.plot(prophet_data['ds'], prophet_data['y'], label='Actual')
        plt.plot(forecast['ds'], forecast['yhat'], color='red', label='Forecast')
        plt.fill_between(forecast['ds'], forecast['yhat_lower'], forecast['yhat_upper'], color='pink', alpha=0.3)
        plt.title("Energy Consumption Forecast")
        plt.xlabel("Date")
        plt.ylabel("Energy Consumption (kWh)")
        plt.legend()
        
        # Ensure plots directory exists
        os.makedirs('plots', exist_ok=True)
        
        # Save plot
        plot_path = 'plots/forecast_plot.png'
        plt.savefig(plot_path)
        plt.close()
        
        # Convert forecast results to a JSON-serializable format
        forecast_json = forecast_results.to_dict(orient='records')
        for item in forecast_json:
            item['ds'] = item['ds'].isoformat()
        
        return {
            "forecast_data": forecast_json,
            "plot_path": plot_path,
            "total_forecast_points": len(forecast_results),
            "input_file": file_path
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/forecast-plot")
async def get_forecast_plot():
    plot_path = 'plots/forecast_plot.png'
    if os.path.exists(plot_path):
        return FileResponse(plot_path, media_type="image/png")
    raise HTTPException(status_code=404, detail="Plot not found")