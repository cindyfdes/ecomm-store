"use client";
import React, { useContext, useEffect, useState } from "react";
import { useCartStore } from "../stores/cart-store";

import ProductCount from "../components/Products/add-to-cart";

const Cart = () => {
  const cart = useCartStore((state) => state.cart);
  const [cartCount, setCartCount] = useState<number>();

  useEffect(() => {
    const count = cart.reduce((acc, elm) => acc + elm.count, 0);
    setCartCount(count);
  }, [cart]);

  return (
    <div className="cart-container p-8">
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>

      <div className="cart-items">
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((cartItem) => {
            return (
              <div
                key={cartItem.product.id}
                className="cart-item flex justify-between p-4 border-b mb-4"
              >
                <div className="cart-item-details flex gap-4">
                  <img
                    src={cartItem.product?.image}
                    alt={cartItem.product?.title}
                    className="w-50 h-50 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{cartItem.product?.title}</h3>
                    <p className="text-gray-600">₹{cartItem.product?.price}</p>
                    <ProductCount product={cartItem.product} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="cart-summary mt-4 p-4 border-t">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Total ({cartCount} items):</span>
            <span>
              ₹
              {cart?.reduce(
                (total, item) =>
                  total + (item?.product?.price || 0) * item.count,
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
