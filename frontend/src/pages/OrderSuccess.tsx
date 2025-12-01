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
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
            <h2 className="text-2xl font-bold text-green-600">Order Confirmed</h2>

            <div className="space-y-1 text-gray-700">
                <p><span className="font-semibold">Order ID:</span> {order._id}</p>
                <p><span className="font-semibold">Date:</span> {new Date(order.orderDate).toLocaleString()}</p>
            </div>

            <div className="space-y-3">
                {order.items.map((it) => (
                    <div
                        key={it.product}
                        className="flex justify-between border-b pb-2 text-gray-700"
                    >
                        <span>
                            {it.name} ({it.size}) x{it.qty}
                        </span>
                        <span>₹{it.price}</span>
                    </div>
                ))}
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
                Total: ₹{order.totalPrice}
            </h3>

            <Link
                to="/"
                className="inline-block w-full text-center bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-700 transition"
            >
                Continue Shopping
            </Link>
        </div>

    );
}
