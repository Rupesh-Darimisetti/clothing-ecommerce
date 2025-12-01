export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
}

export interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (data: LoginPayload) => Promise<void>;
    logout: () => void;
}

export interface CartContextType {
    cart: Cart;
    addItem: (productId: string, size: string, qty?: number, price?: number, name?: string) => Promise<void>;
    updateItem: (productId: string, size: string, qty: number) => Promise<void>;
    removeItem: (productId: string, size: string) => Promise<void>;
    clearCart: () => Promise<void>;
    total: number;
}