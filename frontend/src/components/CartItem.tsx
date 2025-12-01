import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import type { CartItems } from "../types/card";

export default function CartItem({ item }: { item: CartItems }) {
    const { updateItem, removeItem } = useContext(CartContext);

    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-white">
            {/* Product Image */}
            <img
                src={item.product?.image || `https://picsum.photos/seed/${item.product}/80`}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md"
            />

            {/* Info */}
            <div className="flex-1">
                <h4 className="text-lg font-semibold">{item.name}</h4>
                <p className="text-gray-600">Size: {item.size}</p>
                <p className="font-medium text-blue-600">₹{item.price}</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-2">
                    <button
                        onClick={() =>
                            updateItem(item.product, item.size, Math.max(1, item.qty - 1))
                        }
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-lg"
                    >
                        -
                    </button>

                    <span className="text-lg font-semibold">{item.qty}</span>

                    <button
                        onClick={() =>
                            updateItem(item.product, item.size, item.qty + 1)
                        }
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-lg"
                    >
                        +
                    </button>
                </div>

                {/* Remove Button */}
                <button
                    onClick={() => removeItem(item.product, item.size)}
                    className="mt-3 text-red-500 hover:text-red-600 text-sm font-medium"
                >
                    Remove
                </button>
            </div>
        </div>
    );
}
