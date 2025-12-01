import express from "express";
import { placeOrder } from '../controllers/orderController.ts';
import protect from "../middleware/authMiddleware.ts";

const orderRouter = express.Router();

orderRouter.get('/', protect, placeOrder)

export default orderRouter