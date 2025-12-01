import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import api from "../services/api";
import type { Product } from "../types/Product";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [size, setSize] = useState("");
    const [qty, setQty] = useState(1);
    const { addItem } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data);
            setSize((res.data.sizes && res.data.sizes[0]) || "");
        };
        load();
    }, [id]);

    if (!product) return <div>Loading...</div>;

    const handleAdd = async () => {
        await addItem(product._id, size, qty, product.price, product.name);
        navigate("/cart");
    };

    return (
        <div className="product-detail">
            <img src={product.image || `https://picsum.photos/seed/${product._id}/600`} alt={product.name} />
            <div>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>₹{product.price}</p>
                <div>
                    <label>Size</label>
                    <select value={size} onChange={e => setSize(e.target.value)}>
                        {product.sizes?.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label>Quantity</label>
                    <input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))} />
                </div>
                <button onClick={handleAdd}>Add to Cart</button>
            </div>
        </div>
    );
}
