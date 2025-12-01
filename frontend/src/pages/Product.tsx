import { useEffect, useState } from "react";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import type { FiltersType } from "../types/filter";
import type { Product } from "../types/Product";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filters, setFilters] = useState<FiltersType | {}>({});
    const [page, setPage] = useState(1);

    const fetchProducts = async (q = {}) => {
        const params = { ...q, page, limit: 12 };
        const res = await api.get("/products", { params });
        setProducts(res.data.products || []);
    };

    useEffect(() => {
        fetchProducts(filters);
        // eslint-disable-next-line
    }, [page]);

    const applyFilters = (filters: FiltersType | {} | undefined) => {
        setFilters(JSON.stringify(filters));
        setPage(1);
        fetchProducts(filters);
    };

    return (
        <div>
            <h2>Products</h2>
            <Filters onApply={applyFilters} initial={filters} />
            <div className="grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            <div className="pagination flex justify-between t-5">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} className="btn">Prev</button>
                <span>Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} className="btn t-5">Next</button>
            </div>
        </div>
    );
}
