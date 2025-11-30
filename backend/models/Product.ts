import mongoose from "mongoose";

const productScheme = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    sizes: { type: [String], required: true },
    stock: { type: Number, required: true }
}, { timestamps: true })

export default mongoose.model('Product', productScheme);