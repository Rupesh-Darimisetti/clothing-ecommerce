import express from "express";
import { placeOrder } from '../controllers/orderController.ts';
import protect from "../middleware/authMiddleware.ts";

const orderRouter = express.Router();

orderRouter.post('/', protect, placeOrder)

export default orderRouter