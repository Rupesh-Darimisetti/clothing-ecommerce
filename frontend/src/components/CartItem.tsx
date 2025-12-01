import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CartItem({ item }) {
    const { updateItem, removeItem } = useContext(CartContext);

    return (
        <div className="cart-item">
            <img src={item.product?.image || `https://picsum.photos/seed/${item.product}/80`} alt={item.name} />
            <div className="cart-info">
                <h4>{item.name}</h4>
                <p>Size: {item.size}</p>
                <p>Price: ₹{item.price}</p>
                <div>
                    <button onClick={() => updateItem(item.product, item.size, Math.max(1, item.qty - 1))}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateItem(item.product, item.size, item.qty + 1)}>+</button>
                </div>
                <button onClick={() => removeItem(item.product, item.size)}>Remove</button>
            </div>
        </div>
    );
}
