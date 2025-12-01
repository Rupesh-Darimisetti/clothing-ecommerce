import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { CartContext } from "../context/CartContext";
import type { Cart } from "../types/card";

export default function CartPage() {
    const { cart, total, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [items, setItems] = useState<Cart['items']>(cart.items || []);

    useEffect(() => setItems(cart.items || []), [cart]);
    console.log(cart.items)
    const handleCheckout = () => {
        navigate("/checkout");
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

            {items.length === 0 ? (
                <p className="text-gray-600 text-lg">Your cart is empty</p>
            ) : (
                <>
                    {/* Cart Items */}
                    <div className="space-y-4 mb-8">
                        {items.map((item) => (
                            <CartItem
                                key={`${item.product}-${item.size}`}
                                item={item}
                            />
                        ))}
                    </div>

                    {/* Summary Section */}
                    <div className="border-t pt-6 flex justify-between items-center">
                        <h3 className="text-2xl font-semibold">
                            Total: <span className="text-blue-600">₹{total}</span>
                        </h3>

                        <div className="flex gap-4">
                            <button
                                onClick={handleCheckout}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition"
                            >
                                Checkout
                            </button>

                            <button
                                onClick={() => clearCart()}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow transition"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>

    );
}
