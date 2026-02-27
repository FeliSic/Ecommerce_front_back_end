// api/sync.js
import { NextApiRequest, NextApiResponse } from "next";
import { base, client } from "../../lib/algolia_airtable";

export async function syncAirtableToAlgolia(req: NextApiRequest, res: NextApiResponse) {
  console.log("🔄 [CRON] Iniciando sincronización...", new Date().toISOString());

  try {
    const records = await base("ProductsTable")
      .select({ maxRecords: 100 })
      .all();

    const objects = records.map((record) => ({
      objectID: record.id,
      ...record.fields,
    }));

    await client.saveObjects({
      indexName: "ProductosAirtableIndex",
      objects: objects,
    });

    console.log("✅ [CRON] Sincronización exitosa:", objects.length, "productos");

    res.status(200).json({ 
      message: "Sincronización exitosa", 
      count: objects.length 
    });
  } catch (error: any) {
    console.error("Error al sincronizar:", error);
    res.status(500).json({ 
      message: "Error al sincronizar", 
      error: error.message 
    });
  }
}


export async function searchProducts(req: any, res: any) {
  // Obtener parámetros de la query con valores por defecto
  // q: término de búsqueda
  // limit: cantidad de resultados por página (default 10)
  // offset: desde qué resultado empezar (default 0)
  const { query:q, limit = 10, offset = 0 } = req.query;
  console.log("Parámetros de búsqueda:", { q, limit, offset }); // Log para verificar los parámetros recibidos
  try {
    // Convertir limit y offset a enteros a través de la base 10 para evitar errores ya que  estás convirtiendo las cadenas a enteros en el sistema decimal, que es el más común y esperado en la mayoría de los casos.
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);
    //parseInt(limit, 10): Convierte el valor de limit a un número entero en base 10. Esto asegura que cualquier valor que venga como cadena (por ejemplo, "10") se convierta correctamente a un número (10).
    //Importancia de la base: Usar 10 evita confusiones y errores, especialmente si el valor de entrada comienza con 0, ya que podría interpretarse como un número en base octal en algunas situaciones.

    // ✅ API nueva de Algolia v5 - necesita indexName
    const { hits, nbHits } = await client.searchSingleIndex({
      indexName: "ProductosAirtableIndex",
      searchParams: {
        query: q || "", // término de búsqueda
        hitsPerPage: parsedLimit,
        offset: parsedOffset,
      },
    });

    // Responder con los resultados y la info de paginación
    res.status(200).json({
      results: hits, // Resultados encontrados (array)
      pagination: {
        offset: parsedOffset, // Desde qué resultado se muestran
        limit: parsedLimit, // Cuántos resultados por página
        total: nbHits, // Total de resultados que coinciden con la búsqueda
      },
    });
  } catch (error) {
    // En caso de error, loguear y responder con status 500
    console.error("Error al buscar productos:", error);
    res.status(500).json({ message: "Error al buscar productos", error });
  }
}

// Controlador para obtener toda la data de un producto por su ID
export async function getProductById(req:any, res:any) {
  const { id } = req.query;// Obtener el ID del producto de la query

  try {
    // Buscar el producto en la base de datos de Airtable
    const record = await base("ProductsTable").find(id);

    // Si el producto no se encuentra, devolver un error 404
    if (!record) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Transformar el registro para incluir el objectID
    const product = {
      objectID: record.id,
      ...record.fields,
    };

    // Enviar la información del producto en la respuesta
    res.status(200).json({ product });
  } catch (error:any) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ message: "Error al obtener el producto", error: error.message });
  }
}

type AirtableProduct = {
  objectID: string;
  Name: string; // o 'name', elige uno y manténlo consistente
  Precio: number; // asegúrate de que este campo esté presente
  imageUrl: string
  description?: string; // si es opcional
  // Agregá otros campos que tengas en Airtable
};



// helper function para utilizar en purchases:  generatePaymentUrl 
export async function fetchProductById(id: string): Promise<AirtableProduct> {
  try {
    const record = await base("ProductsTable").find(id);
    if (!record) throw new Error("Producto no encontrado");
    
  return {
  objectID: record.id,
  Name: record.fields.Name as string,       // casteo explícito a string
  Precio: record.fields.Precio as number,   // casteo explícito a number
  imageUrl: record.fields.imageUrl as string,
  description: record.fields.description as string | undefined, // si puede ser undefined
  };

  } catch (error: any) {
    throw new Error("Error al obtener el producto: " + error.message);
  }
}



export async function decrementProductStock(productId: string) {
  try {
    const record = await base("ProductsTable").find(productId);
    const currentStock = record.fields.Stock as number || 0;
    
    if (currentStock > 0) {
      await base("ProductsTable").update([
        {
          id: productId,
          fields: {
            Stock: currentStock - 1
          }
        }
      ]);
      console.log(`Stock decrementado para producto ${productId}: ${currentStock} → ${currentStock - 1}`);
    } else {
      console.warn(`Producto ${productId} sin stock disponible`);
    }
  } catch (error) {
    console.error("Error decrementando stock:", error);
  }
}