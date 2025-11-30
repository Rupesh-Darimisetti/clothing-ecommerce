import bcrypt from 'bcryptjs'
import express, { type Request, type Response } from 'express'
import { check, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import Cart from '../models/Cart.js'
import User from '../models/User.js'
const authRouter = express.Router()


authRouter.post('/signup',
    [
        check('username', 'Username is requied').not().isEmpty(),
        check('email', 'Enter a valid email').isEmail(),
        check('password', 'please enter a pasword with minimum of 6 character').isLength({ min: 6 })
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const { username, email, password } = req.body

        try {
            // see if user exists
            let user = await User.findOne({
                email,
            })
            if (user) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'user already exists',
                        },
                    ],
                })
            }
            user = new User({
                username,
                email,
                password,
            })
            // encrypt password
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)
            await user.save()

            // return jwt token
            const payload = {
                user: {
                    id: user.id,
                },
            }
            jwt.sign(
                payload,
                process.env.JWT_SECRET as string,
                {
                    expiresIn: 36000,
                },
                (err: any, token: any) => {
                    if (err) throw err
                    res.json({
                        token,
                    })
                }
            )
        } catch (err) {
            console.log((err as Error).message)
            res.status(500).send('server error')
        }
    }
)

authRouter.post(
    '/login',
    [
        check('email', 'Enter a valid email').isEmail(),
        check('password', 'password is required').exists(),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            })
        }

        const { email, password } = req.body

        try {
            // see if user exists

            let user = await User.findOne({
                email,
            })
            if (!user) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Invalid Credentials',
                        },
                    ],
                })
            }

            //  verify password

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Invalid Credentials',
                        },
                    ],
                })
            }

            // return jwt token

            const payload = {
                user: {
                    id: user.id,
                },
            }
            jwt.sign(
                payload,
                process.env.JWT_SECRET as string,
                {
                    expiresIn: 360000,
                },
                (err: any, token: any) => {
                    if (err) throw err
                    res.json({
                        token,
                    })
                }
            )
        } catch (err) {
            console.log((err as Error).message)
            res.status(500).send('server error')
        }
    }
)

export default authRouter

// Endpoint to sync guest cart to user cart on login
authRouter.post('/sync-cart', async (req: Request, res: Response) => {
    try {
        const { userId, guestCart } = req.body;

        if (!userId || !guestCart || !Array.isArray(guestCart)) {
            return res.status(400).json({ message: 'Invalid data' });
        }

        let userCart = await Cart.findOne({ user: userId });

        if (!userCart) {
            userCart = new Cart({
                user: userId,
                items: []
            });
        }

        // Merge guest cart items with user cart
        for (const guestItem of guestCart) {
            const existingItem = userCart.items.find(
                item => item.product.toString() === guestItem.productId && item.size === guestItem.size
            );

            if (existingItem) {
                // Increase quantity if item exists
                existingItem.qty += guestItem.qty;
            } else {
                // Add new item
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
        await userCart.populate('items.product');

        res.json({
            success: true,
            message: 'Cart synced successfully',
            cart: userCart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error syncing cart' });
    }
})