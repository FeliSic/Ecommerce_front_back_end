import { CheckoutUI } from "@/ui/item"; 
import { useMe, useProduct } from "lib/hooks"; 
import { useRouter } from "next/router";

export function Checkout() {
  const router = useRouter();
  const itemId = router.query.id as string; 
  const { data: userData, error: userError } = useMe();

  // Verifica si el id está definido antes de usarlo
  if (!itemId) {
    return <div>Error: ID no disponible</div>;
  }

const handleConfirmClick = async () => {
  if (!userData?.user?.id) {
    alert('Debes iniciar sesión para realizar una compra');
    router.push('/ingresar');
    return;
  }

  const generateOrderId = () => {
    const randomId = Math.floor(Math.random() * 9000) + 1000; // Genera un número entre 1000 y 9999
    return `#${randomId}`; // Agrega el símbolo #
  }; 

  const orderId = generateOrderId(); // Genera el orderId aquí, después de verificar el login

  // Verifica que data esté disponible antes de hacer la llamada
  if (!data) {
    console.error("Error: No se pudo obtener la información del producto.");
    return;
  }
  const timestamp = Date.now();
  try {
    const res = await fetch(`/api/buy/confirmbuy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderName: data.product?.Name,
        orderDescription: data.product?.description,
        productId: data.product?.objectID || itemId,
        userId: userData.user.id,
        userEmail: userData.user.email,
        orderPrice: data.product?.Precio,
        orderId,
        transactionId: new Date(timestamp).toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error("Error al crear la preferencia de pago");
    }

    const preference = await res.json();
    if (preference.init_point) {
      window.location.href = preference.init_point; // Redirige solo si hay una URL válida
    } else {
      console.error("Error: No se recibió una URL de preferencia válida.");
    }
  } catch (error) {
    console.error("Error al crear la preferencia de pago:", error, userError);
  }
};

  const { data, error, isLoading } = useProduct(itemId); 

  if (isLoading) return <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>Cargando...</div>;
  if (error) return <div>Error al cargar el producto</div>;

  return (
    <CheckoutUI
      name={data.product?.Name}
      description={data.product?.description}
      price={data.product?.Precio}
      src={data.product?.imageUrl}
      objectID={data.product?.objectID || itemId}
      onConfirmClick={handleConfirmClick}
    />
  );
}
