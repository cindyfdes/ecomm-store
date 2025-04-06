"use client";
import React, { useContext } from "react";
import { CartContext } from "../reducers/cart-reducer";
import { CART_ACTIONS_REMOVE_FROM_CART } from "../models/Constants";
import { Products } from "@/app/models/Products";

const Cart = () => {
  const { state, dispatch } = useContext(CartContext);

  const removeFromCart = (productId: number) => {
    dispatch({ type: CART_ACTIONS_REMOVE_FROM_CART, cartItemId: productId });
  };

  const findProductInCart = (prodId: number): Products | undefined =>
    state.products.find((prod) => prod.id === prodId);

  return (
    <div className="cart-container p-8">
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>

      {/* Cart Items */}
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
                    className="w-16 h-16 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{productDetails?.title}</h3>
                    <p className="text-gray-600">₹{productDetails?.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(cartItem.id)}
                  className="remove-btn bg-red-500 text-white py-1 px-3 rounded"
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Summary */}
      {state.cart.length > 0 && (
        <div className="cart-summary mt-4 p-4 border-t">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Total:</span>
            <span>
              ₹
              {state.cart
                ?.map((el) => findProductInCart(el.id))
                ?.reduce((total, item) => total + (item?.price || 0), 0)}
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
