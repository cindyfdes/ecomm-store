import { Products } from "@/app/models/Products";
import React, { useContext } from "react";
import StarRating from "./star-rating";
import { CartContext } from "@/app/reducers/cart-reducer";
import { CART_ACTIONS_ADD_TO_CART } from "@/app/models/Constants";

interface ISingleProductProps {
  product: Products;
}

const SingleProductView = ({ product }: ISingleProductProps) => {
  const { state, dispatch } = useContext(CartContext);

  const addToCartClick = (prodId: number) => {
    console.log("adding tot cart" + prodId);
    dispatch({
      type: CART_ACTIONS_ADD_TO_CART,
      cartItem: { id: prodId },
    });
  };
  console.log("cart", state.cart);
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg h-100 flex flex-col ">
      <img
        className="w-full  h-1/2 object-contain"
        src={product.image}
        alt={product.title}
      />
      <div className="px-6 py-2">
        <div className="font-bold text-xl mb-2 line-clamp-3 text-ellipsis">
          {product.title}
        </div>
      </div>
      <div className="px-6  pb-2 flex items-center flex-col">
        <span className="flex items-center justify-center">
          <div className="px-2">
            <StarRating rating={product.rating?.rate} maxRating={5} />
          </div>
          <p className="text-sm text-gray-600">{product.rating?.count}</p>
        </span>
        <div>&#8377; {product.price}</div>
        <div>
          <button
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            onClick={() => addToCartClick(product.id)}
          >
            Add to cart
          </button>
          <button className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
export default SingleProductView;
