import Searcher from "@/components/Searcher";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Buscador() {
  const router = useRouter();
  const rawQuery = router.query.q || "";
  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;
  const [results, setResults] = useState([]); // Estado para los resultados
  const [total, setTotal] = useState(0); // Estado para el total de resultados

  useEffect(() => {
    if (query) {
      searchProducts(query); // Llamar a la función para buscar productos
    }
  }, [query]);

  const searchProducts = async (query: string) => {
    try {
      const response = await fetch(`/api/search/search?query=${encodeURIComponent(query)}`);
      if (response.ok) {
          const data = await response.json();
          console.log(data); // Verifica la estructura de la respuesta
          setResults(data.results || []); // Guardar los resultados en el estado
          setTotal(data.pagination.total || 0); // Guardar el total de resultados en el estado
      }
      else {
        console.error('Error en la búsqueda');
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    }
  };

  return (
    <Searcher query={query} results={results} total={total}></Searcher>
  );
}
