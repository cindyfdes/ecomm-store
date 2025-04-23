"use client";
import { CartContext } from "@/app/reducers/cart-context";
import React, { use, useContext, useEffect, useState } from "react";
import { Products } from "@/app/models/Products";
import { useParams } from "next/navigation";
import SingleProductView from "@/app/components/Products/single-product-view";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useContext(CartContext);
  const [selectedProduct, setSelectedProduct] = useState<Products>();
  console.log("id", id);
  useEffect(() => {
    const product = state.products.find((prod) => prod.id == parseInt(id));
    console.log(id, state.products);
    if (product) {
      setSelectedProduct(product);
    } else {
      //callnot found component
    }
  }, [id]);
  return (
    <div>
      {selectedProduct ? (
        <SingleProductView product={selectedProduct} />
      ) : (
        <p>No such product</p>
      )}
    </div>
  );
};

export default ProductDetails;
