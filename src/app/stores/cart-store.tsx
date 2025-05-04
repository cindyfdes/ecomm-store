import { Products } from "@/app/models/Products";
import { Cart } from "../models/Cart";

import { create } from "zustand";
import { User } from "firebase/auth";

type cartStore = {
  cart: Cart[];
  products: Products[];
  addProducts: (products: Products[]) => void;
  addToCart: (item: Cart, user: User | null) => void;
  removeFromCart: (
    productId: number,
    cartId: string | undefined,
    user: User | null
  ) => void;
  initializeCart: (items: Cart[]) => void;
};

export const useCartStore = create<cartStore>((set, get) => ({
  cart: [],
  products: [],
  addProducts: (products: Products[]) => {
    set(() => ({ products }));
  },
  addToCart: async (item: Cart, user: User | null) => {
    try {
      if (user) {
        const token = await user.getIdToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart/save-cart-item`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: user.email,
              productId: item.product.id,
              quantity: item.quantity,
              cartId: item.cartId,
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to sync with DB");
        const resDetails = await res.json();
        const cart = get().cart;
        const existing = cart.find((el) => el.product.id === item.product.id);

        if (existing) {
          existing.quantity += item.quantity;
          set({ cart: [...cart] });
        } else {
          set({ cart: [...cart, { ...item, cartId: resDetails.cartId }] });
        }
      } else {
        const cart = get().cart;
        const existing = cart.find((el) => el.product.id === item.product.id);

        if (existing) {
          existing.quantity += item.quantity;
          set({ cart: [...cart] });
          localStorage.setItem("user-cart", JSON.stringify(cart));
        } else {
          set({ cart: [...cart, item] });
          localStorage.setItem("user-cart", JSON.stringify([...cart, item]));
        }
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  },
  removeFromCart: async (
    productId: number,
    cartId: string | undefined,
    user: User | null
  ) => {
    if (user) {
      const token = await user.getIdToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/delete-cart-item`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: user.email,
            productId,
            cartId,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to sync with DB");
      const cart = get().cart;
      const filteredCart = cart.filter((el) => el.product.id !== productId);
      set({ cart: filteredCart });
    } else {
      const cart = get().cart;
      const filteredCart = cart.filter((el) => el.product.id !== productId);
      set({ cart: filteredCart });
      localStorage.setItem("user-cart", JSON.stringify(filteredCart));
    }
  },
  initializeCart: (cart) => {
    set(() => ({ cart }));
  },
}));
