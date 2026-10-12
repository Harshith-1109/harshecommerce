import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure Cloudinary credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ecommerce_uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single('image');

router.post('/', (req, res) => {
    uploadSingleImage(req, res, (err) => {
        if (err) {
            return res.status(400).send({ message: err.message });
        } 
        
        if (req.file) {
            // Cloudinary returns the full permanent secure URL in req.file.path
            return res.status(200).send({
                message: "Image uploaded successfully",
                image: req.file.path,
            });
        } else {
            return res.status(400).send({ message: "No image file provided" });
        }
    });
});

export default router;