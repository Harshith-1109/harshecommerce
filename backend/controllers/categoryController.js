import categoryModel from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.json({ error: "name is required" });
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.json({ error: "already exists" });
        }
        const category = await new categoryModel({ name }).save();
        res.json(category);
    } catch (error) {
        
        console.log(error);
        return res.status(400).json(error);
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params; // 👈 Match route parameter :id

        if (!name) {
            return res.status(400).json({ error: "name is required" });
        }

        const category = await categoryModel.findOne({ _id: id });
        if (!category) {
            return res.status(404).json({ error: "category not found" });
        }

        category.name = name; 
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "internal server error" });
    }
});

const removeCategory = asyncHandler(async (req, res) => {
    try {
        const categoryId = req.params.id.trim(); // 👈 Match route parameter :id
        
        const removed = await categoryModel.findByIdAndDelete(categoryId);
        
        if (!removed) {
            return res.status(404).json({ error: "category not found" });
        }
        
        res.json(removed);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "internal server error" });
    }
});

const listCategory = asyncHandler(async (req, res) => {
    try {
        const all = await categoryModel.find({});
        res.json(all);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
});

const readCategory = asyncHandler(async (req, res) => {
    try {
        const categoryId = req.params.id.trim();
        const category = await categoryModel.findOne({ _id: categoryId });

        if (!category) {
            return res.status(404).json({ error: "category not found" });
        }

        res.json(category);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
});

// ✅ Ensure all functions are properly named and exported here
export { 
    createCategory, 
    updateCategory, 
    removeCategory, 
    listCategory, 
    readCategory 
};