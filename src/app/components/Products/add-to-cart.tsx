import { Cart } from "@/app/models/Cart";
import { useCartStore } from "../../stores/cart-store";
import React, { useContext, useEffect, useState } from "react";
import { Products } from "@/app/models/Products";
import { useAuth } from "@/app/stores/auth-context";

const AddToCart = ({ product }: { product: Products }) => {
  const { user } = useAuth();
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const [productCartDetails, setProductCartDetails] = useState<
    Cart | undefined
  >();

  useEffect(() => {
    setProductCartDetails(cart.find((el) => el.product.id === product.id));
  }, [cart]);

  const addToCartClick = (count: number) => {
    addToCart(
      { product, quantity: count, cartId: productCartDetails?.cartId },
      user
    );
  };

  return (
    <>
      {productCartDetails == undefined ? (
        <button
          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer hover:bg-gray-700 hover:text-white"
          onClick={() => addToCartClick(1)}
        >
          Add to cart
        </button>
      ) : (
        <div className="flex">
          <button
            className={`inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 ${
              productCartDetails.quantity <= 0
                ? "cursor-not-allowed"
                : "hover:bg-gray-700 cursor-pointer hover:text-white"
            }`}
            onClick={() => addToCartClick(-1)}
            disabled={productCartDetails.quantity <= 0}
          >
            -
          </button>
          {productCartDetails.quantity}
          <button
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 ml-2 cursor-pointer hover:bg-gray-700 hover:text-white"
            onClick={() => addToCartClick(1)}
            // disabled={productCartDetails.count >=prod}
          >
            +
          </button>
          <button
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer hover:bg-gray-700 hover:text-white"
            onClick={() => {
              removeFromCart(product.id, productCartDetails.cartId, user);
            }}
          >
            Remove from Cart
          </button>
        </div>
      )}
    </>
  );
};

export default AddToCart;
