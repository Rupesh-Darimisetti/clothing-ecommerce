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
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Products</h2>

            <Filters onApply={applyFilters} initial={filters} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                ))}
            </div>

            <div className="flex items-center justify-between pt-6">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                    disabled={page === 1}
                >
                    Prev
                </button>

                <span className="text-gray-700 font-medium">Page {page}</span>

                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
                >
                    Next
                </button>
            </div>
        </div>

    );
}
