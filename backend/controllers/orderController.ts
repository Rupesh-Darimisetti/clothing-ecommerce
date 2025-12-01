import { type Request, type Response } from "express";
import Cart from "../models/Cart.ts";
import Order from "../models/Order.ts";
import Product from "../models/Product.ts";
import type { OrderType } from "../types/order.ts";
import sendOrderEmail from "../utils/sendEmail.ts";

export const placeOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        // Find user's cart
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        // Validate stock
        for (const item of cart.items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (product.stock < item.qty) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
                });
            }
        }

        // Prepare order items
        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            name: (item.product as any).name,
            size: item.size,
            qty: item.qty,
            price: (item.product as any).price,
        }));

        const totalPrice = orderItems.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
        );

        // Create order
        const order: OrderType = await Order.create({
            user: (req as any).user,
            items: orderItems,
            totalPrice,
            orderDate: new Date(),
            status: "placed",
        });

        // Update stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.qty },
            });
        }

        // Clear cart
        if (cart) {
            cart.items.splice(0);
            await cart.save();
        }

        // Email confirmation
        await sendOrderEmail(order, (req as any).user);

        res.status(201).json({
            message: "Order placed successfully",
            orderId: order._id,
            total: totalPrice,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
