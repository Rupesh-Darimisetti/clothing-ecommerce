import express from 'express';
import {
    addItemToCart,
    deleteItem,
    getUserCart,
    updateItem
} from '../controllers/cartController.ts';
import protect from '../middleware/authMiddleware.ts';

// Middleware to handle both logged-in and guest users
// const cartMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     req.isLoggedIn = !req.user;
//     next();
// }

const cartRouter = express.Router();
cartRouter.use(protect);

// GET /api/cart - Get user's cart (or empty if guest)
cartRouter.get('/', protect, getUserCart);

// POST /api/cart/add - Add item to cart
cartRouter.post('/add', protect, addItemToCart);

// PUT /api/cart/update - Update item quantity in cart
cartRouter.put('/update', protect, updateItem);

// DELETE /api/cart/remove - Remove item from cart
cartRouter.delete('/remove', protect, deleteItem);

export default cartRouter