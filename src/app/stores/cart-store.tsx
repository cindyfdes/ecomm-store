import { Products } from "@/app/models/Products";
import { Cart } from "../models/Cart";

import { create } from "zustand";

type cartStore = {
  cart: Cart[];
  products: Products[];
  addProducts: (products: Products[]) => void;
  addToCart: (cartItem: Cart) => void;
  removeFromCart: (productId: number) => void;
  initializeCart: (items: Cart[]) => void;
};
export const useCartStore = create<cartStore>((set, get) => ({
  cart: [],
  products: [],
  addProducts: (products: Products[]) => {
    set(() => ({ products }));
  },
  addToCart: (cartItem: Cart) => {
    set((state) => {
      const exisitngCartItemIndex = state.cart.findIndex(
        (el) => el.product.id == cartItem.product.id
      );
      if (exisitngCartItemIndex == -1) {
        return { cart: [...state.cart, cartItem] };
      } else {
        const updatedCart = [...state.cart];
        const updatedItem = updatedCart[exisitngCartItemIndex];
        const updatedCount = updatedItem.count + cartItem.count;
        if (updatedCount > 0) {
          updatedCart[exisitngCartItemIndex] = {
            ...updatedItem,
            count: updatedCount,
          };
        } else {
          updatedCart.splice(exisitngCartItemIndex, 1);
        }
        return { cart: updatedCart };
      }
    });
  },
  removeFromCart: (productId: number) => {
    set((state) => {
      return { cart: state.cart.filter((el) => el.product.id !== productId) };
    });
  },
  initializeCart: (cart) => {
    set(() => ({ cart }));
  },
}));
