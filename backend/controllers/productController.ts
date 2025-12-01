import { type Request, type Response } from 'express';
import Product from '../models/Product.ts';



// GET /api/products -> search, filter, pagination
const filterProducts = async (req: Request, res: Response) => {
    try {
        const {
            search,
            category,
            size,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10
        } = req.query;

        const query: Record<string, any> = {};

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Size filter (size must exist in sizes array)
        if (size) {
            query.sizes = size;
        }

        // Price filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find(query)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            products
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
}

// GET /api/products/:id -> single product
const productById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json(product);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
};

export { filterProducts, productById };

