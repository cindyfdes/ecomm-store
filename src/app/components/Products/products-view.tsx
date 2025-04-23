"use client";
import React, { useContext, useEffect, useState } from "react";
import { Products } from "../../models/Products";
import ProductCard from "./product-card";
import { CartContext } from "../../reducers/cart-context";

import { fetchAllProducts } from "./fetch-products";
import { CART_ACTIONS_ADD_PRODUCT } from "../../models/constants/reducerConstants";
import { useSearchParams } from "next/navigation";

const ProductsView = () => {
  const { state, dispatch } = useContext(CartContext);
  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get("sprefix");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchedProducts, setSearchedProducts] = useState<Products[]>([]);

  useEffect(() => {
    setLoading(true);
    const products = fetchAllProducts(null);
    if (products) {
      products
        ?.then((res) => {
          if (res.error) {
            setError(res.error);
            return;
          }
          res.products?.forEach((product: Products) =>
            dispatch({ product, type: CART_ACTIONS_ADD_PRODUCT })
          );
          setSearchedProducts(res.products);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const products = fetchAllProducts(searchKeyword);
    if (products) {
      products
        ?.then((res) => {
          if (res.error) {
            setError(res.error);
            return;
          }
          res.products?.forEach((product: Products) =>
            dispatch({ product, type: CART_ACTIONS_ADD_PRODUCT })
          );
          setSearchedProducts(res.products);
        })
        .finally(() => setLoading(false));
    }
  }, [searchKeyword]);

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
