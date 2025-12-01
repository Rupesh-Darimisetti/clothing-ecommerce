import { Link } from "react-router-dom";
import type { Product } from "../types/Product";


export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="bg-white text-black rounded-xl shadow hover:shadow-lg transition p-4">
            <Link to={`/product/${product._id}`}>
                <img
                    src={`https://picsum.photos/seed/${product._id}/300`}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                />
            </Link>

            <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-700 font-medium">₹{product.price}</p>

                <Link
                    to={`/product/${product._id}`}
                    className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
                >
                    View
                </Link>
            </div>
        </div>


    );
}
