import { useProduct } from "../../lib/hooks";

export function Product({ productId }: { productId: string }) {
  const { data: product, error, isLoading } = useProduct(productId);

  if (isLoading) {
    return <p>Loading product...</p>;
  }
  if (error) {
    return <p>Error loading product data</p>;
  }
  if (!product) {
    return <p>Product not found</p>;
  }
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
    </div>
  );
}
