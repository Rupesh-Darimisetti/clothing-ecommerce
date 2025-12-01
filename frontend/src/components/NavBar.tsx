import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import type { OrderItem } from "../types/order";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);

    const count = cart.items.reduce((curr: number, item: OrderItem) => curr + item.qty, 0);

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
            <div className="flex items-center space-x-6">
                <Link to="/" className="text-xl font-bold text-gray-800 hover:text-gray-600">
                    Clothing
                </Link>
                <Link to="/products" className="text-gray-700 hover:text-gray-500">
                    Products
                </Link>
            </div>

            <div className="flex items-center space-x-6">
                <Link to="/cart" className="text-gray-700 hover:text-gray-500">
                    Cart ({count})
                </Link>

                {!user ? (
                    <>
                        <Link to="/login" className="text-gray-700 hover:text-gray-500">
                            Login
                        </Link>
                        <Link to="/register" className="text-gray-700 hover:text-gray-500">
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <span className="text-gray-700">
                            Hello, {user.name || user.email}
                        </span>
                        <button
                            onClick={logout}
                            className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>

    );
}
