import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import api from "../services/api";
import type { Product } from "../types/Product";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [size, setSize] = useState("");
    const [qty, setQty] = useState(1);
    const { addItem } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data);
            setSize((res.data.sizes && res.data.sizes[0]) || "");
        };
        load();
    }, [id]);

    if (!product) return <div>Loading...</div>;

    const handleAdd = async () => {
        await addItem(product._id, size, qty, product.price, product.name);
        navigate("/cart");
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Image */}
            <div className="w-full">
                <img
                    src={`https://picsum.photos/seed/${product._id}/600`}
                    alt={product.name}
                    className="w-full rounded-xl shadow-md object-cover"
                />
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-6">

                <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>

                <p className="text-gray-600">{product.description}</p>

                <p className="text-2xl font-semibold text-blue-600">₹{product.price}</p>

                {/* Size Selector */}
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-700">Size</label>
                    <select
                        value={size}
                        onChange={e => setSize(e.target.value)}
                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                        {product.sizes?.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* Quantity Selector */}
                <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-700">Quantity</label>
                    <input
                        type="number"
                        min="1"
                        value={qty}
                        onChange={e => setQty(Number(e.target.value))}
                        className="border rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
