import { useAuth } from "@/app/stores/auth-context";
import { useCartStore } from "@/app/stores/cart-store";
import { useEffect } from "react";

export const useLoadCart = () => {
  const initializeCart = useCartStore((state) => state.initializeCart);
  const { user } = useAuth();
  useEffect(() => {
    const fetchInitialCart = async () => {
      try {
        if (user) {
          const token = await user.getIdToken();
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
          initializeCart(data);
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
