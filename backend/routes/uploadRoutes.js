import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${extname}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Checks if the uploaded file's MIME type begins with "image/" 
    // This dynamically allows png, jpg, webp, avif, gif, heic, svg, etc.
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
        
        // 🔑 FIX 2: Fixed the if/else-if/else branching and brace layout
        if (req.file) {
            return res.status(200).send({
                message: "Image uploaded successfully",
                image: `/${req.file.path}`,
            });
        } else {
            return res.status(400).send({ message: "No image file provided" });
        }
    });
});

export default router;