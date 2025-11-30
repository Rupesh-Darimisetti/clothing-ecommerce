import express from 'express';
import { check } from 'express-validator';
import { login, signup, syncUserCart } from '../controllers/authController.js';

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
)

// Endpoint to sync guest cart to user cart on login
authRouter.post('/sync-cart', syncUserCart)

export default authRouter;