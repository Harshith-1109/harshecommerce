import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors'; // 👈 IMPORT CORS

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'; 
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

// 👈 CONFIGURE CORS (Required for cookies/authentication across different Render domains)
app.use(cors({
  origin: true, // Allows requests from your frontend domain
  credentials: true // Allows cookies and authorization headers
}));

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/orders', orderRoutes);

app.get("/api/config/paypal", (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname + '/uploads')));

app.listen(port, () => console.log(`Server running on port ${port}`));