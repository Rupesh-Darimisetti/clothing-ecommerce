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
        <form className="filters" onSubmit={submit}>
            <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
            <input placeholder="Size" value={size} onChange={e => setSize(e.target.value)} />
            <input placeholder="Min price" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
            <input placeholder="Max price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            <button type="submit">Apply</button>
        </form>
    );
}
