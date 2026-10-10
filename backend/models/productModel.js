import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true }, // Fixed capitalization convention
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", // Changed to reference your User model string name
    },
}, { timestamps: true });

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, // Conventionally lowercase 'image'
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    reviews: [reviewSchema], // Fixed: should be an array of review schemas
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 }, // Capitalization fix
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;