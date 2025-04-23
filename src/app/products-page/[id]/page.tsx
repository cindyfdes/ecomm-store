"use client";
import { useCartStore } from "@/app/stores/cart-store";
import React, { use, useContext, useEffect, useState } from "react";
import { Products } from "@/app/models/Products";
import { useParams } from "next/navigation";
import SingleProductView from "@/app/components/Products/single-product-view";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const products: Products[] = useCartStore((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState<Products>();
  console.log("id", id);
  useEffect(() => {
    const product = products.find((prod) => prod.id == parseInt(id));

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
