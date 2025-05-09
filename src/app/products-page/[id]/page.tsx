"use client";
import { useCartStore } from "@/app/stores/cart-store";
import React, { use, useContext, useEffect, useState } from "react";
import { Products } from "@/app/models/Products";
import { useParams } from "next/navigation";
import SingleProductView from "@/app/components/Products/single-product-view";
import { fetchSingleProduct } from "@/app/components/Products/fetch-single-product";
import { Loader } from "@/app/components/loader";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const products: Products[] = useCartStore((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState<Products>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  console.log("id", id);

  useEffect(() => {
    setLoading(true);

    const loadProducts = async () => {
      try {
        const product = products.find((prod) => prod.id == parseInt(id));

        if (product) {
          setSelectedProduct(product);
        } else {
          const product = await fetchSingleProduct(id);

          if (product.error) {
            setError(product.error);
          } else setSelectedProduct(product.product);
        }
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (selectedProduct) {
    return <SingleProductView product={selectedProduct} />;
  }
};

export default ProductDetails;
