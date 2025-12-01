export interface CartItems {
    product: Product;
    name: string;
    size: string;
    qty: number;
    price: number;
}

export interface Cart {
    items: CartItems[];
    total: number;
}
