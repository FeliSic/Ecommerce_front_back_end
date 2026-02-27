import { ItemUI } from "@/ui/item";
import { useProduct } from "lib/hooks";
import { useRouter } from "next/router";


export function Item() {
  const router = useRouter();
  const objectID = router.query.id as string;
  // Verifica si el id está definido antes de usarlo
  if (!objectID) {
    return <div>Error: ID no disponible</div>;
  }

  const handleCheckoutClick = () => {
    router.push(`/checkout/${objectID}`);
  };

  const { data, error, isLoading } = useProduct(objectID);
  if (isLoading) return <div style={{display: "flex", height: "100vh", justifyContent: "center", alignItems: "center"}}>Cargando...</div>;
  if (error) return <div>Error al cargar el producto</div>;

  return (
    <ItemUI
      name={data.product?.Name}
      description={data.product?.description}
      price={data.product?.Precio}
      src={data.product?.imageUrl}
      objectID={data.product?.objectID || objectID}
      onGoCheckoutClick={handleCheckoutClick} // Asegúrate de usar el id correcto
    />
  );
}
