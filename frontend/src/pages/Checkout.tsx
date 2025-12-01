import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import api from "../services/api";

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
        } catch (err) {
            alert(err?.response?.data?.message || "Order failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Checkout</h2>
            <div>
                {cart.items.map(i => (
                    <div key={`${i.product}-${i.size}`}>
                        <strong>{i.name}</strong> x{i.qty} — ₹{i.price}
                    </div>
                ))}
            </div>
            <h3>Total: ₹{total}</h3>
            <button onClick={placeOrder} disabled={loading || cart.items.length === 0}>
                {loading ? "Placing..." : "Place Order"}
            </button>
        </div>
    );
}
