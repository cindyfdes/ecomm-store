"use client";
import React, { useContext, useEffect, useState } from "react";
import { Products } from "../../models/Products";
import ProductCard from "./product-card";

import { fetchAllProducts } from "./fetch-products";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/app/stores/cart-store";
import { Loader } from "../loader";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 ">
        {searchedProducts?.map((product, index) => (
          <ProductCard
            key={`${product.id}-${product.title}-${index}`}
            product={product}
          />
        ))}
      </div>
    );
  }
};

export default ProductsView;
