import { type Request, type Response } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ------------------------
// GET /api/cart
// ------------------------
export const getUserCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        let cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
            await cart.save();
        }

        res.json({
            success: true,
            cart: {
                user: cart.user,
                items: cart.items,
                total: calculateTotal(cart.items),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching cart" });
    }
};

// ------------------------
// POST /api/cart/add
// ------------------------
export const addItemToCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { productId, size, quantity, price } = req.body;

        if (!productId || !size || !quantity || quantity < 1) {
            return res.status(400).json({ message: "Invalid product data" });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.stock < quantity)
            return res.status(400).json({ message: "Insufficient stock" });

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItem = cart.items.find(
            (item: any) =>
                item.product.toString() === productId && item.size === size
        );

        if (existingItem) {
            existingItem.qty += quantity;
        } else {
            cart.items.push({
                product: productId,
                name: product.name,
                size,
                qty: quantity,
                price: price || product.price,
            });
        }

        await cart.save();
        await cart.populate("items.product");

        res.status(201).json({
            success: true,
            message: "Item added to cart",
            cart: {
                user: cart.user,
                items: cart.items,
                total: calculateTotal(cart.items),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding to cart" });
    }
};

// ------------------------
// PUT /api/cart/update
// ------------------------
export const updateItem = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { productId, size, quantity } = req.body;

        if (!productId || !size || quantity === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(
            (item) =>
                item.product.toString() === productId && item.size === size
        );

        if (itemIndex === -1)
            return res.status(404).json({ message: "Item not found in cart" });

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1); // Remove item
        } else {
            const product = await Product.findById(productId);
            if (product && product.stock < quantity) {
                return res.status(400).json({ message: "Insufficient stock" });
            }

            const currItem = cart.items[itemIndex];
            if (!currItem) return res.status(404).json({
                message: "Item not found in the cart"
            })
            currItem.qty = quantity;
        }

        await cart.save();
        await cart.populate("items.product");

        res.json({
            success: true,
            message: "Cart updated",
            cart: {
                user: cart.user,
                items: cart.items,
                total: calculateTotal(cart.items),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating cart" });
    }
};

// ------------------------
// DELETE /api/cart/remove
// ------------------------
export const deleteItem = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { productId, size } = req.body;

        if (!productId || !size) {
            return res.status(400).json({ message: "Product ID and size required" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(
            (item) =>
                item.product.toString() === productId && item.size === size
        );

        if (itemIndex === -1)
            return res.status(404).json({ message: "Item not found in cart" });

        cart.items.splice(itemIndex, 1);

        await cart.save();
        await cart.populate("items.product");

        res.json({
            success: true,
            message: "Item removed from cart",
            cart: {
                user: cart.user,
                items: cart.items,
                total: calculateTotal(cart.items),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing from cart" });
    }
};

// ------------------------
// Utility: Calculate cart total
// ------------------------
function calculateTotal(items: any[]): number {
    return items.reduce((total, item) => total + item.price * item.qty, 0);
}
