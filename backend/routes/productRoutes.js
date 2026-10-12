import express from "express";
const router = express.Router();

import { 
    addProduct, 
    updateProductDetails, 
    removeProduct, 
    fetchProducts, 
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts,
    filterProducts,
} from "../controllers/productController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import upload from "../middlewares/uploadMiddleware.js"; // Use your multer/cloudinary middleware here

// 1. Root route - use your upload middleware instead of formidable
router.route('/')
.get(fetchProducts)
.post(authenticate, authorizeAdmin, upload.single('image'), addProduct);

// 2. STATIC ROUTE MUST COME BEFORE /:id
router.route('/allproducts').get(fetchAllProducts);

router.get('/top', fetchTopProducts);
router.get('/new', fetchNewProducts);

router.route('/reviews/:id').post(authenticate, checkId, addProductReview);

// 3. DYNAMIC ROUTE MUST COME LAST
router.route('/:id')
    .get(fetchProductById)
    .put(authenticate, authorizeAdmin, upload.single('image'), updateProductDetails)
    .delete(authenticate, authorizeAdmin, removeProduct);

router.route('/filtered-products').post(filterProducts);

export default router;