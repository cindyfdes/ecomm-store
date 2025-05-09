export const fetchSingleProduct = async (prodId: string) => {
  let res;
  let product: Product;
  let error;
  try {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getProduct/${prodId}`
    );
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

    product = await res.json();
  } catch (err) {
    console.error("Error fetching products:", err);
    error =
      "An error occurred while fetching products. Please try again later.";
  }

  return { product, error };
};
