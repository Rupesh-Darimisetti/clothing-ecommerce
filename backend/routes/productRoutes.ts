import express from 'express';
import { filterProducts, productById } from '../controllers/productController.js';
const productRouter = express.Router();

// GET /api/products -> search, filter, pagination
productRouter.get('/', filterProducts);

// GET /api/products/:id -> single product
productRouter.get('/:id', productById);

export default productRouter;
