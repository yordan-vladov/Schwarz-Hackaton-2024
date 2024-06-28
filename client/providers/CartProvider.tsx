import React, { createContext, useContext, useState, ReactNode } from "react";

interface Product {
  productId: string;
  name: string;
  price: number;
  imageUri: string;
}

interface CartContextValue {
  cart: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Product[]>([]);

  const addProduct = (product: Product) => {
    setCart((prevCart) => {
      if (prevCart.some((item) => item.productId === product.productId)) {
        return prevCart; 
      }
      return [...prevCart, product];
    });
  };

  const removeProduct = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((product) => product.productId !== productId)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const contextValue: CartContextValue = {
    cart,
    addProduct,
    removeProduct,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
