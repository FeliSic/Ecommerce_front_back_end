import { TitleCentrado } from "@/ui/typography";
import { Input } from "@/ui/text-field";
import styled from "styled-components";
import { BlueButton } from "@/ui/buttons";
import { Card } from "@/ui/cards";
import { useState } from "react";
import router from "next/router";

const BarraDeBusqueda = styled(Input)`
width: 347px !important;
text-align: center;
`;

const SearcherButt = styled(BlueButton)`
  width: 347px;
`

const SalientContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: var(--celeste);

    @media (max-width: 768px) {
    background-color: var(--fucsia);
  }
`;

const CardsRow = styled(SalientContainer)`
  flex-direction: row;
  height: auto;


  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export default function Hub({ query }: { query: string }) {
  const featuredProducts = [
  {
    objectID: "1",
    Name: "Producto Destacado 1",
    Precio: "$100",
    imageUrl: "url_del_producto_1.jpg",
  },
  {
    objectID: "2",
    Name: "Producto Destacado 2",
    Precio: "$150",
    imageUrl: "url_del_producto_2.jpg",
  },
  // Agrega más productos destacados aquí
];



  const [searchValue, setSearchValue] = useState(query); // Estado para el valor del input

  const handleSearchClick = () => {
    if (searchValue.trim()) {
      console.log("Redirigiendo a buscador con query:", searchValue);
      router.push(`/buscador?q=${encodeURIComponent(searchValue)}`);
    } else {
      console.log("No se ingresó ninguna búsqueda.");
      router.push('/buscador');
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100vw", alignItems: "center", padding: 0, margin: 0}}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", margin: "0", height: "100vh", padding: 0 }}>
        <TitleCentrado>El mejor e-commerce del mundo</TitleCentrado>
        <BarraDeBusqueda placeholder="Buscar productos..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        <SearcherButt onClick={handleSearchClick}>BUSCAR</SearcherButt>
      </div>
      <SalientContainer>
        <TitleCentrado>Productos destacados</TitleCentrado>
        <CardsRow>
       {featuredProducts.map((featuredProduct) => (
          <Card 
            key={featuredProduct.objectID} 
            objectID={featuredProduct.objectID} 
            description={featuredProduct.Name} 
            price={featuredProduct.Precio} 
            src="sadasd.jpg" 
            onNavigate={() => router.push(`/item/${featuredProduct.objectID}`)} 
            isFeatured={true} 
          />
        ))}
        </CardsRow>
      </SalientContainer>
    </div>
  );
}

