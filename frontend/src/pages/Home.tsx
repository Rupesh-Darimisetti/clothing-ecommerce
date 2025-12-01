import Products from "./Product";

export default function Home() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Welcome to Clothing
            </h1>

            <Products />
        </div>
    );
}
