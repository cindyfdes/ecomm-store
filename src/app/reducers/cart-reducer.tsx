"use client";
import React, { createContext, ReactNode, useReducer } from "react";
import { Products } from "@/app/models/Products";
import { Cart } from "../models/Cart";

import {
  CART_ACTIONS_ADD_PRODUCT,
  CART_ACTIONS_ADD_TO_CART,
  CART_ACTIONS_REMOVE_FROM_CART,
  CART_ACTIONS_REMOVE_PRODUCT,
} from "../models/constants/reducerConstants";
import { stat } from "fs";

type CartaContextType = { products: Products[]; cart: Cart[] };

type Action =
  | { type: typeof CART_ACTIONS_ADD_PRODUCT; product: Products }
  | { type: typeof CART_ACTIONS_REMOVE_PRODUCT; productId: number }
  | { type: typeof CART_ACTIONS_ADD_TO_CART; cartItem: Cart }
  | { type: typeof CART_ACTIONS_REMOVE_FROM_CART; cartItemId: number };

const reducer = (state: CartaContextType, action: Action) => {
  switch (action.type) {
    case CART_ACTIONS_ADD_PRODUCT:
      return { ...state, products: [...state.products, action.product] };
    case CART_ACTIONS_ADD_TO_CART:
      const existingProductIndex = state.cart.findIndex(
        (el) => el.id === action.cartItem.id
      );
      if (existingProductIndex !== -1) {
        // Product already exists in cart
        const updatedCart = [...state.cart];
        const updatedProduct = updatedCart[existingProductIndex];

        const updatedCount = updatedProduct.count + action.cartItem.count;
        if (updatedCount > 0) {
          updatedCart[existingProductIndex] = {
            ...updatedProduct,
            count: updatedCount,
          };
        } else {
          updatedCart.splice(existingProductIndex, 1);
        }

        return { ...state, cart: updatedCart };
      } else {
        return { ...state, cart: [...state.cart, action.cartItem] };
      }
    case CART_ACTIONS_REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((c) => c.id != action.cartItemId),
      };
    default:
      return state;
  }
};
const initialState: CartaContextType = {
  products: [],
  cart: [],
};
export const CartContext = createContext<{
  state: CartaContextType;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartContext, cartDispatch] = useReducer(reducer, initialState);
  return (
    <CartContext.Provider
      value={{ state: cartContext, dispatch: cartDispatch }}
    >
      {children}
    </CartContext.Provider>
  );
};
