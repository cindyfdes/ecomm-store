"use client";
import React, {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Products } from "@/app/models/Products";
import { Cart } from "../models/Cart";

import {
  CART_ACTIONS_ADD_PRODUCT,
  CART_ACTIONS_ADD_TO_CART,
  CART_ACTIONS_LOAD_INITIAL_CART,
  CART_ACTIONS_REMOVE_FROM_CART,
  CART_ACTIONS_REMOVE_PRODUCT,
} from "../models/constants/reducerConstants";
import { useAuth } from "./auth-context";

type CartaContextType = {
  products: Products[];
  cart: Cart[];
};

type Action =
  | { type: typeof CART_ACTIONS_ADD_PRODUCT; product: Products }
  | { type: typeof CART_ACTIONS_REMOVE_PRODUCT; productId: number }
  | { type: typeof CART_ACTIONS_ADD_TO_CART; cartItem: Cart }
  | { type: typeof CART_ACTIONS_REMOVE_FROM_CART; cartItemId: number }
  | { type: typeof CART_ACTIONS_LOAD_INITIAL_CART; cart: Cart[] };

const reducer = (state: CartaContextType, action: Action) => {
  switch (action.type) {
    case CART_ACTIONS_ADD_PRODUCT:
      if (!state.products.find((prod) => prod.id === action.product.id))
        return { ...state, products: [...state.products, action.product] };
      else return state;
    case CART_ACTIONS_ADD_TO_CART:
      const existingProductIndex = state.cart.findIndex(
        (el) => el.product.id === action.cartItem.product.id
      );
      if (existingProductIndex !== -1) {
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
        cart: state.cart.filter((c) => c.product.id != action.cartItemId),
      };
    case CART_ACTIONS_LOAD_INITIAL_CART:
      return { ...state, cart: action.cart };
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
  const { user } = useAuth();

  useEffect(() => {
    const fetchInitialCart = async () => {
      try {
        if (user) {
          const token = await user?.getIdToken();
          console.log("token", token);
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/cart/getUserCart`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
              },
            }
          );
          const data = await res.json();
          console.log("data from cart context", data);
          cartDispatch({
            type: "LOAD_INITIAL_CART",
            cart: data?.map((c: any) => {
              return { count: c.quantity, product: c.product };
            }),
          });
        }
      } catch (err) {
        console.error("Failed to fetch initial cart", err);
      }
    };
    fetchInitialCart();
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        state: { ...cartContext },
        dispatch: cartDispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
