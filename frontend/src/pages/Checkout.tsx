import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import api from "../services/api";
import type { CartItems } from "../types/card";

export default function Checkout() {
    const { cart, total, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const placeOrder = async () => {
        setLoading(true);
        try {
            const res = await api.post("/orders"); // backend uses protect middleware
            clearCart();
            navigate(`/order/${res.data.orderId}`);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } }
            alert(error?.response?.data?.message || "Order failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>

            <div className="space-y-3">
                {cart.items.map((item: CartItems) => (
                    <div
                        key={`${item.product}-${item.size}`}
                        className="flex justify-between text-gray-700 border-b pb-2"
                    >
                        <span className="font-medium">{item.name}</span>
                        <span>
                            x{item.qty} — ₹{item.price}
                        </span>
                    </div>
                ))}
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
                Total: ₹{total}
            </h3>

            <button
                onClick={placeOrder}
                disabled={loading || cart.items.length === 0}
                className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                {loading ? "Placing..." : "Place Order"}
            </button>
        </div>

    );
}
