import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import type { Order } from "../types/order";

export default function OrderSuccess() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data.order);
            } catch {
                setOrder(null);
            }
        })();
    }, [id]);

    if (!order) return <div>Loading order...</div>;

    return (
        <div>
            <h2>Order Confirmed</h2>
            <p>Order ID: {order._id}</p>
            <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
            <div>
                {order.items.map(it => (
                    <div key={it.product}>
                        {it.name} ({it.size}) x{it.qty} — ₹{it.price}
                    </div>
                ))}
            </div>
            <h3>Total: ₹{order.totalPrice}</h3>
            <Link to="/">Continue Shopping</Link>
        </div>
    );
}
