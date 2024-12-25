import express from 'express';
import multer from 'multer';
import path from 'path';
import postOfficeImageController from '../controller/postOfficeImage.controller.js';


const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Routes
router.post('/upload', upload.single('image'), postOfficeImageController.uploadImage);
router.get('/postoffice/:postOfficeId', postOfficeImageController.getPostOfficeImages);
router.get('/:id', postOfficeImageController.getImage);
router.patch('/:id', postOfficeImageController.updateImage);
router.delete('/:id', postOfficeImageController.deleteImage);

export default router;