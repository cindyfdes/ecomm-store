"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const SearchComponent = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const sprefix = searchParams.get("sprefix");

  useEffect(() => {
    if (sprefix) setSearchKeyword(sprefix);
  }, [sprefix]);

  const searchProducts = () => {
    const params = new URLSearchParams(window.location.search);
    if (searchKeyword.trim()) {
      params.set("sprefix", searchKeyword.trim());
    } else {
      params.delete("sprefix");
    }

    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const timeout = setTimeout(searchProducts, 300);

    return () => clearTimeout(timeout);
  }, [searchKeyword]);

  return (
    <div>
      <input
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        type="text"
        placeholder="Search products..."
        className="w-full py-2 px-4 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 border-gray-500 border-1"
      />
    </div>
  );
};

export default SearchComponent;
