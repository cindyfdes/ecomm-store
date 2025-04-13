"use client";
import React, { useContext, useEffect, useState } from "react";
import { Products } from "../../models/Products";
import ProductCard from "./product-card";
import { CartContext } from "../../reducers/cart-reducer";

import { fetchAllProducts } from "./fetch-products";
import { CART_ACTIONS_ADD_PRODUCT } from "../../models/constants/reducerConstants";

const ProductsView = () => {
  const { state, dispatch } = useContext(CartContext);
  const [error, setError] = useState("");

  useEffect(() => {
    const products = fetchAllProducts();
    if (products) {
      products?.then((res) => {
        if (res.error) {
          setError(error);
          return;
        }
        res.products?.forEach((product: Products) =>
          dispatch({ product, type: CART_ACTIONS_ADD_PRODUCT })
        );
      });
    }
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {state.products?.map((product, index) => (
        <ProductCard
          key={`${product.id}-${product.title}-${index}`}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductsView;
