"use client";
import React, { useContext } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCartStore } from "@/app/stores/cart-store";
import { useLoadCart } from "../hooks/useLoadCart";

const CartStatusDisplay = () => {
  useLoadCart();
  const cart = useCartStore((state) => state.cart);
  return (
    <div className="relative flex pr-2">
      Cart
      <ShoppingCartIcon />
      {cart.length > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -mt-2 -mr-2">
          {cart.length}
        </span>
      )}
    </div>
  );
};

export default CartStatusDisplay;
