import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

const addProduct = asyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand } = req.fields;
        const { image } = req.files;

        // 1. Validation checks
        switch (true) {
            case !name:
                return res.status(400).json({ error: "Name is required" });
            case !description:
                return res.status(400).json({ error: "Description is required" });
            case !price:
                return res.status(400).json({ error: "Price is required" });
            case !category:
                return res.status(400).json({ error: "Category is required" });
            case !quantity:
                return res.status(400).json({ error: "Quantity is required" });
            case !brand:
                return res.status(400).json({ error: "Brand is required" });
        }

        // 2. Create a new 
        // product instance with fields from req.fields
        const product = new Product({ ...req.fields });

        // 3. Handle image upload if provided via express-formidable
        if (image) {
            product.image = image.path;
        }

        // 4. Save to MongoDB
        await product.save();

        // 5. Send success response
        res.status(201).json(product);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

const updateProductDetails = asyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand } = req.fields;
        const { image } = req.files;

        // 1. Validation checks
        switch (true) {
            case !name:
                return res.status(400).json({ error: "Name is required" });
            case !description:
                return res.status(400).json({ error: "Description is required" });
            case !price:
                return res.status(400).json({ error: "Price is required" });
            case !category:
                return res.status(400).json({ error: "Category is required" });
            case !quantity:
                return res.status(400).json({ error: "Quantity is required" });
            case !brand:
                return res.status(400).json({ error: "Brand is required" });
        }

        // 2. Update product using Product.findByIdAndUpdate
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.fields },
            { new: true }
        );

        if (image) {
            product.image = image.path;
            await product.save();
        }

        res.json(product);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

const removeProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product removed successfully", product });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

const fetchProducts = asyncHandler(async (req, res) => {
    try {
        const pageSize = 6;
        const keyword = req.query.keyword
            ? { name: { $regex: req.query.keyword, $options: "i" } }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword }).limit(pageSize);

        res.json({
            products,
            page: 1,
            pages: Math.ceil(count / pageSize),
            hasMore: false,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const fetchProductById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            return res.json(product);
        } else {
            res.status(404);
            throw new Error("Product not found");
        }

    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Product not found" });
    }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({})
            .populate({
                path: "category",
                model: Category,
            })
            .limit(12)
            .sort({ createdAt: -1 });

        res.json(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

const addProductReview = asyncHandler(async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.reviews = product.reviews || [];
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                res.status(400);
                throw new Error("Product already reviewed");
            }

            const review = {
                name: req.user.username,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;

            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: "Review added" });
        } else {
            res.status(404);
            throw new Error("Product not found");
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).sort({ rating: -1 }).limit(4);
        res.json(products);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 }).limit(5);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

const filterProducts = asyncHandler(async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};

        if (checked && checked.length > 0) args.category = checked;
        if (radio && radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

        const products = await Product.find(args);

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export {
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
};