export interface CartItem {
    product: Product;
    name: string;
    size: string;
    qty: number;
    price: number;
}

export interface Cart {
    items: CartItem[];
    total: number;
}
