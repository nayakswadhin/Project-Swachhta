  import axios from "axios";
  import cloudinary from "../config/cloudinary.js";
  import { CleanlinessScore } from "../models/cleanlinessScore.model.js";
  import PostOfficeImage from "../models/image.model.js";
  import { PostOffice } from "../models/postOffice.model.js";
  import { validateImage } from "../utils/imageValidation.js";
  import fs from "fs";
  import { createNotificationPayload } from "../utils/notificationHelper.js";
  import { getIO } from "../utils/socketManager.js";
  import lifeScore from "../models/life.model.js";
  import { DataModel } from "../models/data.model.js";
  import { carbonModel } from "../models/carbon.model.js";

  const postOfficeImageController = {
    async uploadImage(req, res) {
      try {
        // Check if file exists in request
        if (!req.file) {
          return res.status(400).json({ error: "No image file provided" });
        }

        // Validate image
        const validationErrors = validateImage(req.file);
        if (validationErrors.length > 0) {
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ errors: validationErrors });
        }

        // Check if postOfficeId is provided
        if (!req.body.postOfficeId) {
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: "Post office ID is required" });
        }

        try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "post-office-images",
            resource_type: "auto",
          });

          // Create new image document
          const newImage = new PostOfficeImage({
            postOfficeId: req.body.postOfficeId,
            imageUrl: result.secure_url,
            createdAt: req.body.createdAt || new Date(),
            Area: req.body.Area || "Lawns",
          });

          console.log(newImage);

          // Save to database
          await newImage.save();

          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          // Send response
          res.status(201).json(newImage);
        } catch (error) {
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);
          throw error;
        }
      } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: error.message });
      }
    },

    // Get all images for a post office
    async getPostOfficeImages(req, res) {
      try {
        const images = await PostOfficeImage.find({
          postOfficeId: req.params.postOfficeId,
        }).sort({ createdAt: -1 });
        res.json(images);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    // Get single image
    async getImage(req, res) {
      try {
        const image = await PostOfficeImage.findById(req.params.id);
        if (!image) {
          return res.status(404).json({ error: "Image not found" });
        }
        res.json(image);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    // Update image description
    async updateImage(req, res) {
      try {
        const image = await PostOfficeImage.findByIdAndUpdate(
          req.params.id,
          { $set: { description: req.body.description } },
          { new: true, runValidators: true }
        );

        if (!image) {
          return res.status(404).json({ error: "Image not found" });
        }

        res.json(image);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    // Delete image
    async deleteImage(req, res) {
      try {
        const image = await PostOfficeImage.findById(req.params.id);
        if (!image) {
          return res.status(404).json({ error: "Image not found" });
        }

        // Extract cloudinary public ID from URL
        const publicId = image.imageUrl.split("/").slice(-1)[0].split(".")[0];
        await cloudinary.uploader.destroy(publicId);

      await image.deleteOne();
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async handleImage(req, res) {
    try {
      const {
        postOfficeId,
        biodegradable,
        plastic,
        metal,
        paper,
        cardboard,
        glass,
        imageUrl,
        spit,
        selectedArea,
        messy,
        bins,
        overflow,
        numberOfCars,
        numberOfMotorCycle,
        dump,
      } = req.body;

        if (!postOfficeId || !imageUrl) {
          return res
            .status(400)
            .json({ message: "postOfficeId and imageUrl are required" });
        }

        // Ensure all values are valid numbers (fallback to 0 if invalid)
        const values = [plastic, metal, paper, cardboard, glass, biodegradable];
        const validatedValues = values.map((value) =>
          isNaN(value) ? 0 : Number(value)
        );

        let totalCount = validatedValues.reduce((sum, value) => sum + value, 0);
        let percentageOrganicWaste =
          totalCount > 0
            ? Math.round((validatedValues[5] / totalCount) * 100)
            : 0;

      let weight = {
        biodegradable: 0.5,
        paper: 0.3,
        plastic: 1.5,
        cardboard: 1.0,
        glass: 2.0,
        metal: 3.0,
        dump: 1.0,
      };

        let totalweight =
          validatedValues[5] * weight.biodegradable +
          validatedValues[3] * weight.paper +
          validatedValues[4] * weight.cardboard +
          validatedValues[0] * weight.plastic +
          validatedValues[1] * weight.metal +
          validatedValues[2] * weight.glass;

      let w1 = 0.4,
        w2 = 0.3,
        w3 = 0.3,
        w4 = 0.4;
      let frequencyOfWaste = totalCount;
      let totalNonbiodegradable = totalCount - biodegradable;
      // Calculate dump impact based on detected dump locations
      let dumpImpact = 0;
      if (dump && Array.isArray(dump)) {
        // For each detected dump location
        dump.forEach((location) => {
          // Impact increases with confidence and size (width * height)
          const impact =
            (location.confidence * (location.width * location.height)) / 1000;
          dumpImpact += impact;
        });
      }

        let score =
          100 -
          0.2 * biodegradable -
          0.8 * totalNonbiodegradable -
          w2 * frequencyOfWaste -
          w3 * totalweight -
          w4 * spit -
          weight.dump * dumpImpact; // Add dump impact using the weight factor

        if (isNaN(score)) score = 0;

        const recentScore = await CleanlinessScore.findOne({ postOfficeId })
          .sort({ time: -1 })
          .exec();
        const newScore = {
          plastic,
          biodegradable,
          metal,
          paper,
          cardboard,
          glass,
        };
        let differences = {};
        if (recentScore) {
          const categories = [
            "plastic",
            "biodegradable",
            "metal",
            "paper",
            "cardboard",
            "glass",
          ];
          differences = {};
        }

        // Store data of blockchain
        const postOffice = await PostOffice.findById(postOfficeId).select("name");
        const newData = await DataModel.create({
          postOfficeId: postOfficeId,
          location: {
            area: selectedArea,
            postOffice: postOffice.name,
          },
          timestamp: new Date(),
          typeOfWaste: {
            plastic,
            biodegradable,
            metal,
            paper,
            cardboard,
            glass,
          },
          sizeOfWaste: totalweight,
          photolink: imageUrl,
        });
        if (!newData) {
          res.status(400).json({ message: "Cannot upload on blockchain" });
        }

        const dumpLength = dump ? dump.length : 0;

      console.log("dumpLength", dumpLength);
        console.log("dumpLength",dumpLength);

        const previousWaste = await CleanlinessScore.findOne({
          postOfficeId,
          Area: selectedArea
        }).sort({ time: -1 });
        
        let responseTime = null;
        
        if (previousWaste) {
          const currentTime = new Date();
          const previousTime = previousWaste.time;
          const timeDifference = currentTime - previousTime;

          console.log("timeDifference",timeDifference);
          
          // If the current score is less than half of the previous score
          // it indicates cleaning has occurred
          if (score < previousWaste.score / 2) {
            responseTime = timeDifference;
          }
        }
        
        const newWaste = await CleanlinessScore.create({
          postOfficeId,
          percentageOrganicWaste,
          quantity: {
            frequency: {
              plastic,
              biodegradable,
              metal,
              paper,
              cardboard,
              glass,
            },
            size: totalweight,
            totalCount,
          },
          imageUrl,
          score,
          time: new Date(),
          spit,
          Area: selectedArea,
          dump: dumpLength,
          responseTime // Add the calculated response time
        });
        // Life Score Schema update
        let life_score = 0;
        const messyPercentage = messy ? messy * 100 : 0;
        const recyclableCount =
          biodegradable > 0 ? (totalCount - biodegradable) / biodegradable : 0;
        const life_weights = {
          plastic: 0.25,
          recycle: 0.25,
          messy: 0.15,
          green: 0.15,
          bins: 0.15,
        };

        // Calculate life score with validation
        life_score =
          100 -
          life_weights.recycle * (isNaN(recyclableCount) ? 0 : recyclableCount) -
          (plastic || 0) * life_weights.plastic -
          (messy || 0) * life_weights.messy +
          (bins.length || 0) * life_weights.bins +
          (bins.some((bin) => bin.type === "Recyclable Waste") ? 5 : 0) +
          overflow * 1.5;

        // Ensure the score is within valid range
        life_score = Math.max(0, Math.min(100, life_score));

        // Add validation before creating new life score
        if (isNaN(life_score)) {
          life_score = 0;
        }

        const newLifeScore = await lifeScore.create({
          postOfficeId,
          Area: selectedArea,
          amountOfPlastic: plastic || 0,
          recyclableCount: isNaN(recyclableCount) ? 0 : recyclableCount,
          messyPercentage: messyPercentage || 0,
          bins: bins ? bins.length : 0,
          overflow: overflow || 0,
          time: new Date(),
          score: life_score,
        });

        // Create life notification payload
        const lifeNotificationPayload = {
          postOfficeId,
          lifeScore: life_score,
          parameters: {
            area: selectedArea,
            plasticAmount: plastic || 0,
            recyclableWaste: isNaN(recyclableCount) ? 0 : recyclableCount,
            messiness: messyPercentage || 0,
            binCount: bins ? bins.length : 0,
            overflowStatus: overflow || 0,
            timestamp: new Date(),
          },
          message: `New life score update for ${selectedArea}: ${life_score.toFixed(
            2
          )}`,
        };

        // Emit life notification through socket
        getIO().emit("lifeNotification", lifeNotificationPayload);

        const newCarbonWaste = await carbonModel.create({
          postOfficeId,
          Area: selectedArea,
          car: numberOfCars,
          motorCycle: numberOfMotorCycle,
          time: new Date(),
        });

        const calculateWMEI = () => {
          // Weights for WMEI calculation
          const weights = {
            recyclability: 0.3,       // Weight for recyclability ratio
            messiness: 0.2,           // Weight for messiness (litter)
            bins: 0.4,                // Weight for bin availability and segregation
            responseTime: 0.1,        // Weight for response time of waste collection
          };
          
          // Get cleanliness score (use the existing score or default to 50)
          const cleanlinessScore = score || 50;
          
          // Calculate recyclability ratio (non-biodegradable to biodegradable)
          const totalNonBio = plastic + metal + glass + paper + cardboard;
          const recyclabilityRatio = biodegradable > 0 ? totalNonBio / biodegradable : totalNonBio;
          
          // Normalize recyclability ratio to avoid extreme values
          const normalizedRecyclabilityRatio = Math.min(1, recyclabilityRatio); // Max cap at 1 for normalization
          
          // Calculate bin ratio (recyclable bins to total bins)
          const recyclableBinCount = bins.filter(bin => bin.type === "Recyclable Waste").length;
          const binRatio = bins.length > 0 ? recyclableBinCount / bins.length : 0;
          
          // Normalize bin ratio
          const normalizedBinRatio = Math.min(1, binRatio); // Cap bin ratio at 1 for normalization
          
          // Calculate messiness score (on a scale from 0 to 5, higher is messier)
          const messinessScore = (messy || 0); // Messiness score can range from 0 to 5
          
          // Calculate waste overflow score (higher overflow is worse, should negatively affect WMEI)
          const wasteOverflow = overflow || 0; // Overflow can be in kilograms
          
          // Calculate WMEI (Waste Management and Environmental Index)
          let wmei =
            cleanlinessScore -
            weights.recyclability * normalizedRecyclabilityRatio -
            weights.messiness * messinessScore +
            weights.bins * normalizedBinRatio * 100 + // Boost bin availability (scaled by 100 for clarity)
            weights.responseTime * (responseTime || 0); // Lower response time is better
          
          // Penalize waste overflow (higher overflow decreases score)
          wmei -= Math.min(1, wasteOverflow / 50) * 10; // 10-point penalty for waste overflow (max penalty at 50 kg overflow)
          
          // Normalize score between 0 and 100
          wmei = Math.max(0, Math.min(100, wmei));
          
          return isNaN(wmei) ? 50 : wmei;
        };

        const allScores = await CleanlinessScore.find({ postOfficeId });
        const averageScore =
          allScores.reduce((acc, curr) => acc + curr.score, 0) / allScores.length;

        const allLifeScores = await lifeScore.find({ postOfficeId });
        const averageLifeScore =
          allLifeScores.reduce((acc, curr) => acc + curr.score, 0) /
          allLifeScores.length;

        const wasteManagementScore = calculateWMEI();

        //overall score
        let greenScore = 0;
        const pO = await PostOffice.findById(postOfficeId, "energyScore");
        if (!pO) {
          console.log("Post Office not found");
          return null;
        }
        const overallScore =
          (score +
            life_score +
            wasteManagementScore +
            greenScore +
            pO.energyScore) /
          5;

        // Update PostOffice document with all scores
        const updatedPostOffice = await PostOffice.findByIdAndUpdate(
          postOfficeId,
          {
            $push: { photoLinks: imageUrl },
            $set: {
              cleanlinessScore: averageScore.toFixed(2),
              lifeScore: averageLifeScore.toFixed(2),
              wasteManagementScore: wasteManagementScore.toFixed(2), // Changed from wasteManagement to wasteManagementScore
              overallScore: overallScore,
            },
          },
          { new: true }
        );

        if (!updatedPostOffice) {
          return res.status(404).json({ message: "Post Office not found" });
        }

        // Create and emit socket notification
        const notificationPayload = createNotificationPayload({
          postOfficeId,
          score,
          quantity: { totalCount },
          percentageOrganicWaste,
          dump: dumpLength
        });

        getIO().emit("wasteNotification", notificationPayload);

        res.status(200).json({
          message: "Successfully Uploaded",
          percentageOfOrganic: percentageOrganicWaste,
          updatedPostOffice,
          newScore,
          newScore: averageScore.toFixed(2),
          avgLifeScore: averageLifeScore.toFixed(2),
          wasteManagement: wasteManagementScore.toFixed(2),
          lifeNotification: lifeNotificationPayload, // Include notification in response
          differences: {
            plastic: {
              newScore: newScore["plastic"] || 0,
              previous: recentScore.quantity.frequency["plastic"] || 0,
            },
            biodegradable: {
              newScore: newScore["biodegradable"] || 0,
              previous: recentScore.quantity.frequency["biodegradable"] || 0,
            },
            metal: {
              newScore: newScore["metal"] || 0,
              previous: recentScore.quantity.frequency["metal"] || 0,
            },
            paper: {
              newScore: newScore["paper"] || 0,
              previous: recentScore.quantity.frequency["paper"],
            },
            cardboard: {
              newScore: newScore["cardboard"] || 0,
              previous: recentScore.quantity.frequency["cardboard"] || 0,
            },
            glass: {
              newScore: newScore["glass"] || 0,
              previous: recentScore.quantity.frequency["glass"] || 0,
            },
          },
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: "An error occurred while processing the image.",
          details: error.message,
        });
      }
    },
  };

  export default postOfficeImageController;
