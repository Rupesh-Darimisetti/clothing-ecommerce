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
        <nav className="flex ">
            <div className="flex justify-start">
                <Link to="/" className="brand">Clothing</Link>
                <Link to="/products">Products</Link>
            </div>
            <div className="nav-right">
                <Link to="/cart">Cart ({count})</Link>
                {!user ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <span>Hello, {user.name || user.email}</span>
                        <button onClick={logout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}
