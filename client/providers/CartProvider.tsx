import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the product type
interface Product {
  id: string;
  name: string;
  imageURI: string;
}

// Define the shape of the context value
interface CartContextValue {
  cart: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
}

// Create the Cart context with an undefined default value
const CartContext = createContext<CartContextValue | undefined>(undefined);

// Define props for the provider component
interface CartProviderProps {
  children: ReactNode;
}

// Cart provider component
export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Product[]>([]);

  // Add a product to the cart
  const addProduct = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // Remove a product from the cart
  const removeProduct = (productId: string) => {
    setCart((prevCart) => prevCart.filter((product) => product.id !== productId));
  };

  // Context value to be provided
  const contextValue: CartContextValue = {
    cart,
    addProduct,
    removeProduct,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the Cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
