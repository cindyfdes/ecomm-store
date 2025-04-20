import Link from "next/link";
import Auth from "./components/Auth";
import ProductsView from "./components/Products/products-view";
import Layout from "./components/layout/layout";
import { CartProvider } from "./reducers/cart-reducer";
import { Products } from "./models/Products";
import { Suspense } from "react";
export default function Home() {
  return (
    <div className="  items-center justify-items-center min-h-screen  pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Suspense fallback={<p>Loading...</p>}>
          <ProductsView />
        </Suspense>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
