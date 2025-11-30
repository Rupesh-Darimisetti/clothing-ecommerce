import type { NextFunction, Request, Response } from "express";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("Error: ", err.stack);
    res.status(500).json({
        message: err.message || 'Server Error'
    })
}

export default errorHandler