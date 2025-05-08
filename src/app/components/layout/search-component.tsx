"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Category } from "@/app/models/Category";
import { Products } from "@/app/models/Products";

const SearchComponent = () => {
  const CATEGORY_ALL = "all";
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [hasCategoryOptionsLoaded, setHasCategoryOptionsLoaded] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_ALL);
  const [searchedProducts, setSearchedProducts] = useState<Products[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const sprefix = searchParams.get("sprefix");

  useEffect(() => {
    if (sprefix) setSearchKeyword(sprefix);
  }, [sprefix]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchProducts = () => {
    const params = new URLSearchParams(window.location.search);
    if (searchKeyword.trim()) {
      params.set("sprefix", searchKeyword.trim());
    } else {
      params.delete("sprefix");
    }
    router.push(`?${params.toString()}`);
    setSelectedCategory(CATEGORY_ALL);
  };

  const autocompleteProducts = useCallback(async () => {
    let res;
    if (selectedCategory == CATEGORY_ALL) {
      res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getProduct?searchKeyword=${searchKeyword}`
      );
    } else {
      res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getProduct?searchKeyword=${searchKeyword}&category=${selectedCategory}`
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
    let products = await res.json();
    setSearchedProducts(products);
  }, [searchKeyword, selectedCategory]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchKeyword.trim() === "") {
        setSearchedProducts([]);
        setShowSuggestions(false);
        return;
      }
      if (showSuggestions) autocompleteProducts();
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchKeyword, selectedCategory]);

  const loadOptions = useCallback(async () => {
    if (hasCategoryOptionsLoaded) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getAllCategories`
      );
      const data = await res.json();
      setCategoryOptions(data);
      setHasCategoryOptionsLoaded(true);
    } catch (err) {
      console.error("Failed to load options:", err);
    }
  }, [hasCategoryOptionsLoaded]);

  const handleProductClicked = (id: number) => {
    setSearchedProducts([]);
    setShowSuggestions(false);
    router.push("/products-page/" + id);
  };
  return (
    <div
      ref={containerRef}
      className=" flex flex-row items-center border-gray-500 border-1 focus:ring-2 focus:ring-yellow-500 rounded-md  text-gray-800 bg-white w-1/2  "
    >
      <label htmlFor="category" className="sr-only">
        Choose a category
      </label>
      <select
        id="category"
        name="category"
        className="text-sm text-gray-800 bg-white h-full py-2 px-3 rounded-l-md focus:outline-none capitalize flex-1/4 "
        onFocus={loadOptions}
        aria-label="Choose a category"
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
      >
        <option value={CATEGORY_ALL}>All</option>
        {categoryOptions.map((opt) => (
          <option key={opt.categoryId} value={opt.categoryId}>
            {opt.name}
          </option>
        ))}
      </select>
      <div className="relative flex-grow w-full py-2 px-4">
        <input
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          type="text"
          placeholder="Search Products"
          className=" focus:outline-none w-full"
          onClick={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchProducts();
              setShowSuggestions(false);
            }
          }}
        />
        {showSuggestions && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
            {searchedProducts.map((prod) => (
              <li
                className="px-4 py-2 hover:bg-yellow-100 hover:text-black cursor-pointer transition-colors duration-150"
                key={prod.id || prod.title}
                onClick={() => handleProductClicked(prod.id)}
              >
                {prod.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <SearchIcon
        className="hover:bg-yellow-100 hover:text-black cursor-pointer transition-colors duration-150 "
        onClick={searchProducts}
      />
    </div>
  );
};

export default SearchComponent;
