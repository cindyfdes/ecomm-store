"use client";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../reducers/cart-reducer";

import { Products } from "@/app/models/Products";
import ProductCount from "../components/Products/add-to-cart";
import { stat } from "fs";

const Cart = () => {
  const { state, dispatch } = useContext(CartContext);
  const [cartCount, setCartCount] = useState(0);
  console.log("cart state", state);
  useEffect(() => {
    const count = state.cart.reduce((acc, elm) => acc + elm.count, 0);
    setCartCount(count);
  }, [state.cart]);

  const findProductInCart = (prodId: number): Products | undefined =>
    state.products.find((prod) => prod.id === prodId);

  return (
    <div className="cart-container p-8">
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>

      <div className="cart-items">
        {state.cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          state.cart.map((cartItem) => {
            const productDetails = findProductInCart(cartItem.id);
            return (
              <div
                key={cartItem.id}
                className="cart-item flex justify-between p-4 border-b mb-4"
              >
                <div className="cart-item-details flex gap-4">
                  <img
                    src={productDetails?.image}
                    alt={productDetails?.title}
                    className="w-50 h-50 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{productDetails?.title}</h3>
                    <p className="text-gray-600">₹{productDetails?.price}</p>
                    <ProductCount prodId={cartItem.id} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Summary */}
      {state.cart.length > 0 && (
        <div className="cart-summary mt-4 p-4 border-t">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Total ({cartCount} items):</span>
            <span>
              ₹
              {state.cart
                ?.map((el) => {
                  return { product: findProductInCart(el.id), cartItem: el };
                })
                ?.reduce(
                  (total, item) =>
                    total + (item?.product?.price || 0) * item.cartItem.count,
                  0
                )}
            </span>
          </div>
          <button className="checkout-btn bg-blue-600 text-white py-2 px-4 rounded mt-4 w-full">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
