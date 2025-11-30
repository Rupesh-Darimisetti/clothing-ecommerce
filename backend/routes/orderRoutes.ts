import express from "express";
import { placeOrder } from '../controllers/orderController.js';
import protect from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.get('/', protect, placeOrder)

export default orderRouter