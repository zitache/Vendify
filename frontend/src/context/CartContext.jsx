import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'vendify_cart';

const loadCart = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(loadCart);

    // Sauvegarde dans localStorage à chaque changement
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch {}
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCart(prev =>
            prev.map(item => item.id === id ? { ...item, quantity } : item)
        );
    };

    const clearCart = () => {
        setCart([]);
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
    };

    const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price || 0) * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
