import { Products } from "@/app/models/Products";
import React, { useContext } from "react";
import StarRating from "./star-rating";
import AddToCart from "./add-to-cart";
import Link from "next/link";
import Image from "next/image";

interface ISingleProductProps {
  product: Products;
}

const ProductCard = ({ product }: ISingleProductProps) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg   flex flex-col hover:shadow-lg transition border border-gray-300 p-2 h-100">
      <Image
        className="w-full  h-1/2 object-contain"
        width={180}
        height={200}
        src={product.image}
        alt={product.title}
      />

      <div className="font-bold text-m md:text-xl mb-2 line-clamp-2 text-ellipsis overflow-hidden pt-4">
        <Link href={"/products-page/" + product.id}>{product.title}</Link>
      </div>

      <div className="flex items-center flex-col mt-auto ">
        <div className="flex flex-col gap-2  items-center justify-center  lg:gap-4 lg:flex-row">
          <div className="px-2">
            <StarRating rating={product.rating?.rate} maxRating={5} />
          </div>
          <p className="text-sm text-gray-600">
            {product.rating?.count} ratings
          </p>
        </div>

        <div className="py-2">&#8377; {product.price}</div>

        <AddToCart product={product} />
      </div>
    </div>
  );
};
export default ProductCard;
