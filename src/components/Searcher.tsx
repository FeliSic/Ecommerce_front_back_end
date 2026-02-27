import { Card } from "@/ui/cards";
import { BusquedaHeader, BusquedaHeaderButt} from "@/ui/layout";

import { Tiny } from "@/ui/typography";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

const Results = styled(Tiny)`
  margin: 20px;
`
// MobileSearcher.js (nuevo componente)
const MobileSearcherContainer = styled.div`
  display: none; // Ocultar en desktop

  @media (max-width: 768px) {
    display: flex;
    width:100vw;
    height: 138px;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    margin: 0;
    margin-top: -3px;
    gap: 10px;
    background-color: #000;
    position: sticky; /* Fijo en la parte superior */ 
  }
`;

export function MobileSearcher({ handleSearchClick, searchValue, onSearchChange }: { handleSearchClick: (query: string) => void; searchValue: string; onSearchChange: (value: string) => void; }) {
  return (
    <MobileSearcherContainer>
      <BusquedaHeader 
        placeholder="Buscar productos..." 
        value={searchValue} // Asignar el valor del input
        onChange={(e) => onSearchChange(e.target.value)} // Manejar el cambio del input
      />
      <BusquedaHeaderButt onClick={() => handleSearchClick(searchValue)}>BUSCAR</BusquedaHeaderButt>
    </MobileSearcherContainer>
  );
}

const VerMas = styled.button`
  margin-top: -100px;
  background-color: transparent;
  border: none;
`


export default function Searcher({ query, results, total }: { query: string, results: any[], total: number }) {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(10); // Cantidad de productos visibles
  const [searchValue, setSearchValue] = useState(""); // Estado para el valor del input
  const handleSearchClick = (query: string) => {
    if (router.pathname === '/buscador') {
      console.log("Redirigiendo a buscador con query:", query);
      router.push('/buscador?q=' + query);
    } else {
      router.push('/buscador');
    }
    setSearchValue(""); 
  };

  const handleVerMas = () => {
    setVisibleCount((prevCount) => prevCount + 10); // Aumentar la cantidad visible en 10 cada vez que se haga clic en "Ver más"
  };
  
  const checkFunction = () => {
    console.log("Función de verificación ejecutada");
  };
  return (
    <>
    <div style={{display: "flex", justifyContent: "center", alignItems: "flex-start", flexDirection: "column", flexWrap: "wrap",}}>
      <MobileSearcher
      handleSearchClick={handleSearchClick}
      searchValue={searchValue} // Pasar el valor del input
      onSearchChange={setSearchValue} // Pasar la función para actualizar el valor
      ></MobileSearcher>
      <Results>{results.length} resultados de búsqueda para: {query} de {total}</Results>
      </div>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", marginBottom: "100px", gap: "100px",  flexWrap: "wrap"}}>
      {results.slice(0, visibleCount).map((product) => (
        <Card 
          key={product.objectID} 
          objectID={product.objectID} 
          description={product.Name} 
          price={product.Precio} 
          src={product.imageUrl} 
          onNavigate={() => router.push(`/item/${product.objectID}`)} // Lógica de navegación aquí
        />
      ))}
      </div>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "220px"}}>
      <VerMas onClick={(e) => { e.preventDefault(); handleVerMas(); checkFunction(); }}>Ver más</VerMas>
      </div>
    </>
  );
}
