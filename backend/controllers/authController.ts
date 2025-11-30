import bcrypt from "bcryptjs";
import { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import Cart from "../models/Cart.js";
import User from "../models/User.js";

/* ================================ SIGNUP =============================== */
export const signup = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                errors: [{ msg: "User already exists" }],
            });
        }

        user = new User({ username, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { user: { id: user.id } };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: 36000 },
        );
        return res.json(token)
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

/* ================================ LOGIN  ================================ */
export const login = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                errors: [{ msg: "Invalid Credentials" }],
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                errors: [{ msg: "Invalid Credentials" }],
            });
        }

        const payload = { user: { id: user.id } };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: 360000 });
        return res.json(token);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

/* ================================
   SYNC USER CART
================================ */
export const syncUserCart = async (req: Request, res: Response) => {
    try {
        const { userId, guestCart } = req.body;

        if (!userId || !guestCart || !Array.isArray(guestCart)) {
            return res.status(400).json({ message: "Invalid data" });
        }

        let userCart = await Cart.findOne({ user: userId });

        if (!userCart) {
            userCart = new Cart({
                user: userId,
                items: []
            });
        }

        // Merge guest cart items
        for (const guestItem of guestCart) {
            const existingItem = userCart.items.find(
                (item) =>
                    item.product.toString() === guestItem.productId &&
                    item.size === guestItem.size
            );

            if (existingItem) {
                existingItem.qty += guestItem.qty;
            } else {
                userCart.items.push({
                    product: guestItem.productId,
                    name: guestItem.name,
                    size: guestItem.size,
                    qty: guestItem.qty,
                    price: guestItem.price
                });
            }
        }

        await userCart.save();
        await userCart.populate("items.product");

        res.json({
            success: true,
            message: "Cart synced successfully",
            cart: userCart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error syncing cart" });
    }
};
