import express, { type NextFunction, type Request, type Response } from 'express'
import protect from '../middleware/authMiddleware.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

const cartRouter = express.Router()

// Middleware to handle both logged-in and guest users
const cartMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.isLoggedIn = !req.user;
    next();
}

cartRouter.use(cartMiddleware);

// GET /api/cart - Get user's cart (or empty if guest)
cartRouter.get('/', protect, async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: []
            });
            await cart.save();
        }

        res.json({
            success: true,
            cart: {
                user: cart.user,
                items: cart.items,
                total: calculateTotal(cart.items)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
});

// POST /api/cart/add - Add item to cart
cartRouter.post('/add', protect, async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { productId, size, quantity, price } = req.body;

        if (!productId || !size || !quantity || quantity < 1) {
            return res.status(400).json({ message: 'Invalid product data' });
        }

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: []
            });
        }

        // Check if item already exists in cart
        const existingItem = cart.items.find(
            item => item.product.toString() === productId && item.size === size
        );

        if (existingItem) {
            existingItem.qty += quantity;
        } else {
            cart.items.push({
                product: productId,
                name: product.name,
                size,
                qty: quantity,
                price: price || product.price
            });
        }

        await cart.save();
        await cart.populate('items.product');

        res.status(201).json({
            success: true,
            message: 'Item added to cart',
            cart: {
                user: cart.user,
                items: cart.items,
                total: calculateTotal(cart.items)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding to cart' });
    }
});

// PUT /api/cart/update - Update item quantity in cart
cartRouter.put('/update', protect, async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { productId, size, quantity } = req.body;

        if (!productId || !size || quantity === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (quantity < 0) {
            return res.status(400).json({ message: 'Quantity must be non-negative' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && item.size === size
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity === 0) {
            // Remove item if quantity is 0
            cart.items.splice(itemIndex, 1);
        } else {
            // Check stock
            const product = await Product.findById(productId);
            if (product && product.stock < quantity) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }
            cart.items[itemIndex].qty = quantity;
        }

        await cart.save();
        await cart.populate('items.product');

        res.json({
            success: true,
            message: 'Cart updated',
            cart: {
                user: cart.user,
                items: cart.items,
                total: calculateTotal(cart.items)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating cart' });
    }
});

// DELETE /api/cart/remove - Remove item from cart
cartRouter.delete('/remove', protect, async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { productId, size } = req.body;

        if (!productId || !size) {
            return res.status(400).json({ message: 'Product ID and size are required' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && item.size === size
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
        await cart.populate('items.product');

        res.json({
            success: true,
            message: 'Item removed from cart',
            cart: {
                user: cart.user,
                items: cart.items,
                total: calculateTotal(cart.items)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing from cart' });
    }
});

// Helper function to calculate total price
function calculateTotal(items: any[]): number {
    return items.reduce((total, item) => total + (item.price * item.qty), 0);
}

export default cartRouter