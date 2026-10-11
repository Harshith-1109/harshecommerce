import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// 🔑 Ensure the uploads directory exists on startup/runtime
const uploadDir = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${extname}`);
    }
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
            // 🔑 Return a clean relative path starting with /uploads/
            return res.status(200).send({
                message: "Image uploaded successfully",
                image: `/uploads/${req.file.filename}`,
            });
        } else {
            return res.status(400).send({ message: "No image file provided" });
        }
    });
});

export default router;