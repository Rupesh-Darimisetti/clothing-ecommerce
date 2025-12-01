import { useState } from "react";
import type { FiltersType } from "../types/filter";

interface FilterProps {
    onApply: (filters: FiltersType) => void;
    initial?: FiltersType;
}

export default function Filters({ onApply, initial = {} }: FilterProps) {
    const [search, setSearch] = useState(initial.search || "");
    const [category, setCategory] = useState(initial.category || "All");
    const [size, setSize] = useState(initial.size || "");
    const [minPrice, setMinPrice] = useState(initial.minPrice || "");
    const [maxPrice, setMaxPrice] = useState(initial.maxPrice || "");

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        onApply({ search, category, size, minPrice, maxPrice });
    };

    return (
        <form
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow"
            onSubmit={submit}
        >
            <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            <input
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            <input
                placeholder="Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            <input
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            <input
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            <button
                type="submit"
                className="col-span-1 sm:col-span-2 lg:col-span-3 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 transition"
            >
                Apply
            </button>
        </form>

    );
}
