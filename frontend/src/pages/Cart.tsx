import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { CartContext } from "../context/CartContext";

export default function CartPage() {
    const { cart, total, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [items, setItems] = useState(cart.items || []);

    useEffect(() => setItems(cart.items || []), [cart]);

    const handleCheckout = () => {
        navigate("/checkout");
    };

    return (
        <div>
            <h2>Your Cart</h2>
            {items.length === 0 ? <p>Your cart is empty</p> : (
                <>
                    <div>
                        {items.map(it => <CartItem key={`${it.product}-${it.size}`} item={it} />)}
                    </div>
                    <div className="cart-summary">
                        <h3>Total: ₹{total}</h3>
                        <button onClick={handleCheckout}>Checkout</button>
                        <button onClick={() => { clearCart(); }}>Clear Cart</button>
                    </div>
                </>
            )}
        </div>
    );
}
