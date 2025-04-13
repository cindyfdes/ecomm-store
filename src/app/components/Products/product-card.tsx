import { Products } from "@/app/models/Products";
import React, { useContext } from "react";
import StarRating from "./star-rating";
import { CartContext } from "@/app/reducers/cart-reducer";
import { CART_ACTIONS_ADD_TO_CART } from "@/app/models/Constants";
import AddToCart from "./add-to-cart";
import Link from "next/link";
import Image from "next/image";

interface ISingleProductProps {
  product: Products;
}

const ProductCard = ({ product }: ISingleProductProps) => {
  const { state, dispatch } = useContext(CartContext);

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg lg:h-100 md:h-150 flex flex-col ">
      <Image
        className="w-full  h-1/2 object-contain"
        width={180}
        height={200}
        src={product.image}
        alt={product.title}
      />
      <div className="px-6 py-2">
        <div className="font-bold text-xl mb-2 line-clamp-3 text-ellipsis">
          <Link href={"/products-page/" + product.id}>{product.title}</Link>
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
          <AddToCart prodId={product.id} />
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
