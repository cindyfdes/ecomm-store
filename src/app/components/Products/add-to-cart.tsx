import { Cart } from "@/app/models/Cart";
import {
  CART_ACTIONS_ADD_TO_CART,
  CART_ACTIONS_REMOVE_FROM_CART,
} from "@/app/models/constants/reducerConstants";
import { CartContext } from "../../reducers/cart-reducer";
import React, { useContext, useEffect, useState } from "react";

const AddToCart = ({ prodId }: { prodId: number }) => {
  const { state, dispatch } = useContext(CartContext);
  const [productCartDetails, setProductCartDetails] = useState<
    Cart | undefined
  >();

  useEffect(() => {
    setProductCartDetails(state.cart.find((el) => el.id === prodId));
  }, [state.cart]);

  const addToCartClick = (prodId: number, count: number) => {
    dispatch({
      type: CART_ACTIONS_ADD_TO_CART,
      cartItem: { id: prodId, count },
    });
  };

  return (
    <>
      {productCartDetails == undefined ? (
        <button
          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer hover:bg-gray-700 hover:text-white"
          onClick={() => addToCartClick(prodId, 1)}
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
            onClick={() => addToCartClick(prodId, -1)}
            disabled={productCartDetails.count <= 0}
          >
            -
          </button>
          {productCartDetails.count}
          <button
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 ml-2 cursor-pointer hover:bg-gray-700 hover:text-white"
            onClick={() => addToCartClick(prodId, 1)}
            // disabled={productCartDetails.count >=prod}
          >
            +
          </button>
          <button
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer hover:bg-gray-700 hover:text-white"
            onClick={() => {
              dispatch({
                type: CART_ACTIONS_REMOVE_FROM_CART,
                cartItemId: prodId,
              });
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
