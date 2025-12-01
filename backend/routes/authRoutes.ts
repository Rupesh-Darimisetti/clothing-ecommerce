import express from 'express';
import { check } from 'express-validator';
import { login, logout, signup, syncUserCart, userDetails } from '../controllers/authController.ts';
import protect from '../middleware/authMiddleware.ts';

const authRouter = express.Router()


authRouter.post('/signup',
    [
        check('username', 'Username is requied').not().isEmpty(),
        check('email', 'Enter a valid email').isEmail(),
        check('password', 'please enter a pasword with minimum of 6 character').isLength({ min: 6 })
    ],
    signup
);

authRouter.post(
    '/login',
    [
        check('email', 'Enter a valid email').isEmail(),
        check('password', 'password is required').exists(),
    ],
    login
);

authRouter.get('/me', protect, userDetails)

authRouter.post('/logout', logout);
// Endpoint to sync guest cart to user cart on login
authRouter.post('/sync-cart', syncUserCart)

export default authRouter;