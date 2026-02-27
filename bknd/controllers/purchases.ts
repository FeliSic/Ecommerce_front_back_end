import sequelizeClient from "../models/db";
import { QueryTypes } from "sequelize";
import { Purchases, syncDatabase } from "../models/models";
import { createSingleProductPreference, CreatePrefOptions } from 'lib/mercadopago';
import { fetchProductById } from "./products";
import { verifyToken } from "lib/jwt-auth";
import { NextApiRequest } from "next";

type Order = {
  id: number;
  productId: string;
  userId: number; // Suponiendo que necesitas un ID de usuario
  amount: number;
  paymentStatus: string;
  createdAt: Date;
};

type AirtableProduct = {
  objectID: string;
  Name: string; // o 'name', elige uno y manténlo consistente
  Precio: number; // asegúrate de que este campo esté presente
  description?: string; // si es opcional
  // Agregá otros campos que tengas en Airtable
};
// ✅ Variable para trackear si ya se inicializó
let isInitialized = false;

async function ensureTablesExist() {
  if (!isInitialized) {
    await syncDatabase();
    isInitialized = true;
  }
}

async function fetchUserById(token: string): Promise<number> {
  if (!token) {
    throw new Error("Token ausente");
  }

  // Verificar el token y obtener el userId
const tokenData = verifyToken(token);
if (!tokenData || typeof tokenData === 'string') {
  throw new Error("Token inválido");
}

const userId = tokenData.id; // Ahora sabemos que tokenData es JwtPayload
return userId;
}


// export async function createOrder(req: NextApiRequest, productId: string): Promise<{ url: string; orderId: number }> {
//   await ensureTablesExist(); // Esperar a que existan las tablas

//   // Obtener el userId (esto depende de cómo estés manejando la autenticación)
//   const token = req.headers.authorization?.split(" ")[1] || "";
//   const userId = await fetchUserById(token);
//   if (!userId) {
//     throw new Error("No se encontró el usuario"); // Podrías lanzar un 401 aquí
//   }

//   // Obtener el producto y su precio
//   const product: AirtableProduct = await fetchProductById(productId);
//   if (!product) {
//     throw new Error("No se encontró el producto");
//   }

//   const amount = product.Precio; // Asegúrate de que este campo sea correcto

//   const order = {
//     productId,
//     userId,
//     amount,
//     paymentStatus: "pending",
//     createdAt: new Date(),
//   };

//   console.log("Valores de entrada:", { productId, userId, amount });

//   // Usar el método create de Sequelize para insertar la orden
//   const createdOrder = await sequelizeClient.model('Purchases').create(order) as Purchases;

//   const orderId = createdOrder.id; // Obtener el ID de la orden creada

//   if (orderId === undefined) {
//     throw new Error("No se pudo crear la orden, ID indefinido");
//   }

//   // Aquí deberías integrar con MercadoPago para generar la URL de pago
//   const paymentUrl = await generatePaymentUrl(orderId, productId, amount, userId);

//   return { url: paymentUrl, orderId };
// }





export async function confirmOrder(orderId: string) {
  await ensureTablesExist(); // ✅ Esperá a que existan las tablas
  
  await sequelizeClient.query(
    "UPDATE purchases SET \"paymentStatus\" = 'confirmed' WHERE id = $1",
    { 
      bind: [orderId],
      type: QueryTypes.UPDATE
    }
  );

  console.log(`Order ${orderId} confirmed`);
  return true;
}


export async function getConfirmedPayments(): Promise<Order[]> {
  await ensureTablesExist(); // ✅ Esperá a que existan las tablas
  
  const results = await sequelizeClient.query<any>(
    `SELECT * FROM purchases WHERE "paymentStatus" = 'confirmed'`,
    { type: QueryTypes.SELECT }
  );
  
  return results.map((row) => ({
    id: row.id,
    productId: row.productId,
    userId: row.userId,
    amount: row.amount,
    createdAt: row.createdAt,
    paymentStatus: row.paymentStatus,
  }));
}



// Función para obtener todas las órdenes de un usuario
export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  await ensureTablesExist(); // Esperar a que existan las tablas
  
  const results = await sequelizeClient.query<Order>(
    `SELECT * FROM purchases WHERE "userId" = :userId`, // Usar :userId como marcador
    {
      replacements: { userId }, // Pasar el valor aquí
      type: QueryTypes.SELECT,
    }
  );

  return results.map((row) => ({
    id: row.id,
    productId: row.productId,
    userId: row.userId,
    amount: row.amount,
    createdAt: row.createdAt,
    paymentStatus: row.paymentStatus,
  }));
}

// Función para obtener una orden por ID
export async function getOrderById(orderId: number): Promise<Order | null> {
  const results = await sequelizeClient.query<Order>(
    "SELECT * FROM purchases WHERE id = $1",
    {
      bind: [orderId],
      type: QueryTypes.SELECT,
    }
  );
  if (results.length === 0) return null; // Devuelve null si no hay resultados

  const row = results[0]; // Tomar el primer resultado
  return {
    id: row.id,
    productId: row.productId,
    userId: row.userId,
    amount: row.amount,
    createdAt: row.createdAt,
    paymentStatus: row.paymentStatus,
  };
}

// Implementa la función para generar la URL de pago con MercadoPago
export async function generatePaymentUrl(orderId: string, productId: string, amount: number, userId: number, userEmail: string): Promise<string> {
  const productDetails = await fetchProductById(productId);

  const prefOptions: CreatePrefOptions = {
    orderName: productDetails.Name,
    orderDescription: productDetails.description as string,
    orderId: orderId,
    orderPrice: amount,
    transactionId: orderId,
    productId: productId, // Agregado
    userId: userId, // Agregado
    userEmail: userEmail,
    back_urls: {
      success: "http://localhost:3000/success",
      failure: "http://localhost:3000/failure",
      pending: "http://localhost:3000/pending",
    },
    auto_return: "approved",
  };

  const prefResponse = await createSingleProductPreference(prefOptions);
  return prefResponse.init_point as string;
}


export async function updateGoalAmount(goalId:number, amount:number) {
    const [affectedCount] = await sequelizeClient.query(
        "UPDATE goals SET actual_amount = actual_amount + $1 WHERE id = $2",
        { bind: [amount, goalId] }
    );

    console.log(`Filas afectadas en la actualización de goals: ${affectedCount}`);
}


// Para probar webhooks localmente con ngrok:

//# En una terminal nueva
//npx ngrok http 4004
// Luego, copiar la URL generada y usarla para configurar el webhook en MercadoPago


