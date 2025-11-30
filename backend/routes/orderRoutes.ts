import express, { type Request, type Response } from "express";
import protect from "../middleware/authMiddleware";
import Cart from "../models/Cart";
import Product from "../models/Product";
import productRouter from "./productRoutes";

import sendOrderEmail from './utils/sendEmail';

const orderRouter = express.Router();

orderRouter.get('/', protect, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id // authMiddleware attaches req.user

        // find user cart
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length == 0)
            return res.status(400).json({ message: 'your cart is empty' })

        // validate stock
        for (const item of cart.items) {
            const product = await Product.findById(item.product);

            if (!product) return res.status(404).json({ message: "Product not found" })

            if (product.stock < item.qty) {
                return res.json({
                    message: `Not enough stock for ${product.name}. Availabel: ${product.stock}`
                });
            }
        }

        // prepare order items
        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            size: item.size,
            qty: item.qty,
            price: item.product.price,
        }));

        const totalPrice = orderItems.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
        )

        // create order
        const order = await order.create({
            user: usrerId,
            item: orderItems,
            totalPrice,
            orderDat: new Date(),
            status: 'placed'
        })

        // deduct stock
        for (const item of cart.items) {
            await productRouter.findByIdAndUpdate(item.product, {
                $inc: { stocks: -item.qty }
            });
        }

        // clear chart
        cart.items = []
        await cart.save()

        // send email
        await sendOrderEmail(order, req.user);

        res.status(201).json({
            message: "Order placed successfully",
            orderId: order._id,
            total: totalPrice,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'server error', error: error.messge })
    }
}
)

export default orderRouter