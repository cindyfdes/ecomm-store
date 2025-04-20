"use client";
import React, { createContext, ReactNode, useEffect, useReducer } from "react";
import { Products } from "@/app/models/Products";
import { Cart } from "../models/Cart";

import {
  CART_ACTIONS_ADD_PRODUCT,
  CART_ACTIONS_ADD_TO_CART,
  CART_ACTIONS_LOAD_INITIAL_CART,
  CART_ACTIONS_REMOVE_FROM_CART,
  CART_ACTIONS_REMOVE_PRODUCT,
} from "../models/constants/reducerConstants";
import { stat } from "fs";

type CartaContextType = { products: Products[]; cart: Cart[] };

const saveCart = (productId: number, quantity: number) => {
  if (true) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/save-cart-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@123",
        productId,
        quantity,
      }),
    });
  }
};

const deleteFromCart = (productId: number) => {
  if (true) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/delete-cart-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@123",
        productId,
      }),
    });
  }
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
        saveCart(action.cartItem.product.id, updatedCount);
        return { ...state, cart: updatedCart };
      } else {
        saveCart(action.cartItem.product.id, 1);

        return { ...state, cart: [...state.cart, action.cartItem] };
      }
    case CART_ACTIONS_REMOVE_FROM_CART:
      deleteFromCart(action.cartItemId);
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

const getUserCart = () => {};
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

  useEffect(() => {
    const fetchInitialCart = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart/getUserCart`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json", email: "test@123" },
          }
        );
        const data = await res.json();

        cartDispatch({
          type: "LOAD_INITIAL_CART",
          cart: data?.map((c:{quantity:number}extends Products) => {
            return { count: c.quantity, product: c.product };
          }),
        });
      } catch (err) {
        console.error("Failed to fetch initial cart", err);
      }
    };

    fetchInitialCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ state: cartContext, dispatch: cartDispatch }}
    >
      {children}
    </CartContext.Provider>
  );
};
