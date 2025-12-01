import type { Product } from "./Product.ts";
import type { UserType } from "./user.ts";

export interface OrderItem {
    product: Product;
    name: string,
    qty: number;
    size: string;
    price: number;
}

export interface OrderType {
    user: UserType["_id"],
    _id: string;
    items: OrderItem[];
    totalPrice: number;
    status: string;
    orderDate: string;
}
