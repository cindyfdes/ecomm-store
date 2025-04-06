"use server";

import { Products } from "@/app/models/Products";

export const fetchAllProducts = async () => {
  console.log("inside get server side props");
  let products: Products[] = [];
  let error: string | null = null;

  try {
    const res = await fetch("http://localhost:4000/api/getAllProducts");

    if (!res.ok) {
      throw new Error(`Failed to fetch products, status: ${res.status}`);
    }

    products = await res.json();
    console.log("length of products" + products.length);
  } catch (err) {
    console.error("Error fetching products:", err);
    error =
      "An error occurred while fetching products. Please try again later.";
  }

  return {
    products,
    error,
  };
};
