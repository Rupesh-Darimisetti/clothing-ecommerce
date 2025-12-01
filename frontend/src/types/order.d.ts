export interface OrderItem {
    product: Product;
    name: string,
    qty: number;
    size: string;
    price: number;
}

export interface Order {
    _id: string;
    items: OrderItem[];
    totalPrice: number;
    status: string;
    orderDate: string;
}
