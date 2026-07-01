import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
  setCart((prev) => {
    const existing = prev.find(i => i.idMeal === item.idMeal);
    if (existing) {
      return prev.map(i =>
        i.idMeal === item.idMeal ? { ...i, quantity: i.quantity + 1 } : i
      );
    }

    // Tambahkan harga agar keranjang bisa menghitung total
    const priceId = parseInt(item.idMeal || "0");
    const dummyPrice = 15000 + ((priceId % 35) * 1000);

    return [...prev, { ...item, quantity: 1, price: dummyPrice }];
  });
};



    const decreaseQty = (idMeal) => {
        setCart((prev) => {
            return prev
                .map(i => i.idMeal === idMeal ? { ...i, quantity: i.quantity - 1 } : i)
                .filter(i => i.quantity > 0);
        });
    };

    const removeFromCart = (idMeal) => {
        setCart((prev) => prev.filter(i => i.idMeal !== idMeal));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, decreaseQty, removeFromCart, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
