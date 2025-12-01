import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config.js';
import express, { type NextFunction, type Request, type Response } from 'express';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from './routes/orderRoutes.js';
import productRouter from './routes/productRoutes.js';


connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

