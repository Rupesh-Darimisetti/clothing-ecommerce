import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.ts";

/*
    JWT FORMAT:
    {
        id: "mongodb_user_id_here"
    }
*/

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

// -------------------------------
// Protect Middleware
// -------------------------------
const protect = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt;

    if (!token) {
        return res.status(401).json({ message: "Not authorized" });
    }

    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

        // Fetch user from MongoDB
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found or deleted" });
        }

        // Attach user to req without TS errors
        (req as any).user = user;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// -------------------------------
// Optional Auth Middleware
// -------------------------------
const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt;

    if (!token) {
        (req as any).user = undefined;
        return next();
    }

    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

        const user = await User.findById(decoded.id).select("-password");

        (req as any).user = user || undefined;
    } catch {
        (req as any).user = undefined;
    }

    next();
};

export default protect;
export { optionalAuth };

