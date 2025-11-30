import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Protect route - requires authentication
const protect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt;
    if (!token) {
        return res.status(401).json({ message: 'Not authorized' })
    }

    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT secret not configured' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' })
    }
}

// Optional auth - allows both authenticated and guest users
const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt;

    if (token) {
        try {
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ message: 'JWT secret not configured' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            req.user = decoded;
        } catch (error) {
            // Token is invalid but we still allow guest access
            req.user = undefined;
        }
    }

    next();
}

export default protect;
export { optionalAuth };
