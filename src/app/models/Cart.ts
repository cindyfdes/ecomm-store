import { Products } from "./Products";

export type Cart = {
  quantity: number;
  cartId?: string;
  product: Products;
};
