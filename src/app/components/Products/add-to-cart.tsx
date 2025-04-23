import { Cart } from "@/app/models/Cart";
import {
  CART_ACTIONS_ADD_TO_CART,
  CART_ACTIONS_REMOVE_FROM_CART,
} from "@/app/models/constants/reducerConstants";
import { CartContext } from "../../reducers/cart-context";
import React, { useContext, useEffect, useState } from "react";
import { Products } from "@/app/models/Products";
import { useAuth } from "@/app/reducers/auth-context";

const AddToCart = ({ product }: { product: Products }) => {
  const { user } = useAuth();
  const { state, dispatch } = useContext(CartContext);
  const [productCartDetails, setProductCartDetails] = useState<
    Cart | undefined
  >();

  useEffect(() => {
    console.log("state.cart", state.cart);
    setProductCartDetails(
      state.cart.find((el) => el.product.id === product.id)
    );
  }, [state.cart]);

  const saveCartToDB = async (productId: number, quantity: number) => {
    if (user) {
      const token = await user.getIdToken();

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/save-cart-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          productId,
          quantity,
        }),
      });
    }
  };

  const addToCartClick = (count: number) => {
    saveCartToDB(product.id, count);
    dispatch({
      type: CART_ACTIONS_ADD_TO_CART,
      cartItem: { product: product, count },
    });
  };

  const deleteCartFromDb = async (productId: number) => {
    if (user) {
      const token = await user.getIdToken();
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/delete-cart-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          productId,
        }),
      });
    }
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
              productCartDetails.count <= 0
                ? "cursor-not-allowed"
                : "hover:bg-gray-700 cursor-pointer hover:text-white"
            }`}
            onClick={() => addToCartClick(-1)}
            disabled={productCartDetails.count <= 0}
          >
            -
          </button>
          {productCartDetails.count}
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
              dispatch({
                type: CART_ACTIONS_REMOVE_FROM_CART,
                cartItemId: product.id,
              });
              deleteCartFromDb(product.id);
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
