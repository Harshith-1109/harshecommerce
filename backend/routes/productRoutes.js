import express from "express";
import formidable from "express-formidable";
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
     // Make sure this is imported!
} from "../controllers/productController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js"

// 1. Root route
router.route('/')
.get(fetchProducts)
.post(authenticate, authorizeAdmin, formidable(), addProduct);

// 2. STATIC ROUTE MUST COME BEFORE /:id
router.route('/allproducts').get(fetchAllProducts);



router.get('/top',fetchTopProducts)
router.get('/new',fetchNewProducts)

router.route('/reviews/:id').post(authenticate,checkId,addProductReview)

// 3. DYNAMIC ROUTE MUST COME LAST
router.route('/:id')
    .get(fetchProductById)
    .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
    .delete(authenticate, authorizeAdmin, removeProduct);

router.route('/filtered-products').post(filterProducts)

export default router;