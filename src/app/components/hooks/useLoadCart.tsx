import { Cart } from "@/app/models/Cart";
import { useAuth } from "@/app/stores/auth-context";
import { useCartStore } from "@/app/stores/cart-store";
import { useEffect } from "react";

export const useLoadCart = () => {
  const initializeCart = useCartStore((state) => state.initializeCart);
  const addToCart = useCartStore((state) => state.addToCart);

  const { user } = useAuth();

  const getCartItemsFromDb = async (token: string): Promise<Cart[]> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cart/getUserCart`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data;
  };
  useEffect(() => {
    const fetchInitialCart = async () => {
      try {
        if (user) {
          const cartItems = localStorage.getItem("user-cart");
          let localStorageCartItems: Cart[] = [];
          if (cartItems) {
            localStorageCartItems = JSON.parse(cartItems);
          }
          const token = await user.getIdToken();
          const savedCart = await getCartItemsFromDb(token);

          const missingFromDb = localStorageCartItems?.filter(
            (localItem: Cart) =>
              !savedCart.some(
                (dbItem) => dbItem.product.id == localItem.product.id
              )
          );

          initializeCart([...savedCart, ...missingFromDb]);
        } else {
          const cartItems = localStorage.getItem("user-cart");
          if (cartItems) {
            const parsed = JSON.parse(cartItems);
            initializeCart(parsed);
          }
        }
      } catch (err) {
        console.error("Failed to load cart", err);
      }
    };

    fetchInitialCart();
  }, [user, initializeCart]);
};
