import { Link } from "react-router-dom";
import type { Product } from "../types/Product";


export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="card text-black">
            <Link to={`/product/${product._id}`}>
                <img src={`https://picsum.photos/seed/${product._id}/300`} alt={product.name} />
            </Link>
            <div className="card-body">
                <h3>{product.name}</h3>
                <p>₹{product.price}</p>
                <Link to={`/product/${product._id}`} className="btn">View</Link>
            </div>
        </div>
    );
}
