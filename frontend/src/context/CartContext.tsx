import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import type { CartContextType } from "../types/auth";
import type { Cart, CartItems } from "../types/card";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext<CartContextType>({
    cart: { items: [] },
    addItem: async () => { },
    updateItem: async () => { },
    removeItem: async () => { },
    clearCart: async () => { },
    total: 0
});

const LOCAL_KEY = "clothing_cart_v1";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

    // Load local cart on mount
    useEffect(() => {
        const raw = localStorage.getItem(LOCAL_KEY);
        if (raw) {
            try {
                setCart(JSON.parse(raw));
            } catch {
                setCart({ items: [], total: 0 });
            }
        }
    }, []);

    // Save local cart whenever it changes (guest)
    useEffect(() => {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(cart));
    }, [cart]);

    // When user logs in, sync local cart with server
    useEffect(() => {
        const sync = async () => {
            if (user) {
                try {
                    // send local cart array to backend to merge, backend route: /auth/sync-cart
                    const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{"items": []}');
                    await api.post("/auth/sync-cart", {
                        userId: user.id, guestCart: local.items.map((item: CartItems) => ({
                            productId: item.product,
                            name: item.name,
                            size: item.size,
                            qty: item.qty,
                            price: item.price
                        }))
                    });
                    // fetch server cart
                    const res = await api.get("/cart");
                    setCart(res.data.cart || { items: [] });
                    localStorage.removeItem(LOCAL_KEY);
                } catch (err) {
                    // fallback: keep local cart
                }
            } else {
                // not logged in -> keep local cart
            }
        };
        sync();
    }, [user]);

    const addItem = async (productId: string, size: string, qty: number = 1, price: number | null = null, name: string = "") => {
        if (user) {
            // add on server
            const res = await api.post("/cart/add", { productId, size, qty, price });
            setCart(res.data);
        } else {
            // guest: update local
            setCart((prev) => {
                const items: CartItems[] = [...prev.items];
                const idx = items.findIndex(item => item.product === productId && item.size === size);
                if (idx >= 0) items[idx].qty += qty;
                else items.push({ product: productId, name, size, qty, price: price || 0 });
                return { items, total: 0 };
            });
        }
    };

    const updateItem = async (productId: string, size: string, qty: number) => {
        if (user) {
            const res = await api.put("/cart/update", { productId, size, quantity: qty });
            setCart(res.data);
        } else {
            setCart(prev => {
                const items = prev.items.map(i => {
                    if (i.product === productId && i.size === size) return { ...i, qty };
                    return i;
                }).filter(i => i.qty > 0);
                const total = items.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);
                return { items, total };
            });
        }
    };

    const removeItem = async (productId: string, size: string) => {
        if (user) {
            const res = await api.delete(`/cart/remove`, { data: { productId, size } });
            setCart(res.data);
        } else {
            setCart(prev => {
                const items = prev.items.filter(i => !(i.product === productId && i.size === size));
                const total = items.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0)
                return { items, total };
            });
        }
    };

    const clearCart = async () => {
        if (user) {
            // backend clear could be implemented; fallback to fetching empty cart
            const res = await api.get("/cart");
            setCart(res.data.cart || { items: [] });
        } else {
            setCart({ items: [], total: 0 });
            localStorage.removeItem(LOCAL_KEY);
        }
    };

    const total = cart.items.reduce((s, it) => s + (it.price || 0) * it.qty, 0);

    return (
        <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
};
