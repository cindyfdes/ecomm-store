"use client";
import React, { useContext, useEffect, useState } from "react";
import { Products } from "../../models/Products";
import ProductCard from "./product-card";

import { fetchAllProducts } from "./fetch-products";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/app/stores/cart-store";

const ProductsView = () => {
  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get("sprefix");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchedProducts, setSearchedProducts] = useState<Products[]>([]);
  const addProducts = useCartStore((state) => state.addProducts);
  const products: Products[] = useCartStore((state) => state.products);
  console.log("searchKeyword", searchKeyword);

  useEffect(() => {
    setLoading(true);

    const rawProducts = fetchAllProducts(searchKeyword);
    if (rawProducts) {
      rawProducts
        ?.then((res) => {
          if (res.error) {
            setError(res.error);
            return;
          }
          addProducts(res.products);
        })
        .finally(() => setLoading(false));
    }
  }, [searchKeyword]);

  useEffect(() => {
    setSearchedProducts(products);
  }, [products]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {loading ? (
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      ) : (
        <>
          {searchedProducts?.map((product, index) => (
            <ProductCard
              key={`${product.id}-${product.title}-${index}`}
              product={product}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ProductsView;
