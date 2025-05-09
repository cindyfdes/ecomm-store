import { Products } from "@/app/models/Products";
import Image from "next/image";
import React from "react";
import StarRating from "./star-rating";
import AddToCart from "./add-to-cart";

const SingleProductView = ({ product }: { product: Products }) => {
  return (
    <div>
      <div className="grid grid-cols-3 grid-rows-3 pt-7 justify-center">
        <div className="relative w-full aspect-[3/4] md:aspect-[4/3] ">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 1000px) 100vw, 33vw"
          />
        </div>

        <div className="pl-6 col-span-2">
          <span className="text-3xl">{product.title}</span>
          <div className="flex pt-3 pb-3 items-center">
            <StarRating maxRating={5} rating={product.rating.rate} />
            <span className="pl-2">{product.rating.count} ratings</span>
          </div>
          <hr />
          <div>
            <span>&#8377;</span>
            <span className=" text-4xl mt-7 "> {product.price}</span>
            <div>Inclusive of all taxes</div>
          </div>
          <div className="pt-6">
            <AddToCart product={product} />
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductView;
