"use server";

import { Products } from "@/app/models/Products";
import { Console } from "console";

export const fetchAllProducts = async (searchKeyword: string | null) => {
  console.log("searchKeyword", searchKeyword);
  let products: Products[] = [];
  let error: string | null = null;
  let res;
  try {
    if (!searchKeyword) {
      res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getAllProducts`
      );
    } else {
      res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getProduct?searchKeyword=${searchKeyword}`
      );
    }
    if (!res.ok) {
      const raw = await res.text();

      let message = "";
      try {
        const errorData = JSON.parse(raw);
        message = errorData.message || JSON.stringify(errorData);
      } catch {
        message = raw;
      }
      throw new Error(
        `Failed to fetch products, status: ${res.status} - ${message}`
      );
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
