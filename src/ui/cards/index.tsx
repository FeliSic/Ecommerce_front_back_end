import styled from "styled-components";
import { Large, Subtitle } from "../typography";

import { useRouter } from "next/router";

const Rectangle = styled.div`
  top: 1216px;
  opacity: 1;
  width: 315px;
  margin: 0 20px;
  margin-bottom: 10px;
  height: 321px;
  display: flex; /* Agregado */
  flex-direction: column; /* Alinea en columna */
  justify-content: flex-end; /* Alinea al final (parte inferior) */
  border-radius: var(--radius);
  border: 4px solid #000;

  @media (min-width: 748px){
    margin-bottom: 30px;
  }
`

const Description = styled(Large)`
  flex-wrap: wrap; /* Ocupa el espacio disponible */
  margin-left: 10px; /* Espacio entre el texto y el precio */
`;

export const Price = styled(Subtitle)`
  margin-right: 20px;
  white-space: nowrap; /* Evita que el precio se ajuste */
`;


const OtherRectangle = styled.div`
height: 84px;
top: 234px;
left: 2px;
display: flex; /* Agregado */
align-items: center;
justify-content: space-between; /* Espacio entre */
opacity: 1;
background-color: var(--fucsia);
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 237px; /* 321 - 84 (altura de OtherRectangle) */
  overflow: hidden;
  border-top-left-radius: var(--radius);
  border-top-right-radius: var(--radius);
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Para que la imagen cubra el contenedor sin deformarse */
  display: block;
`;

interface CardProps {
  description?: string;
  price?: string;
  src?: string;
  objectID?: string;
  onNavigate?: () => void;
  isFeatured?: boolean; // Prop opcional para indicar si es destacada
}

export function Card({ 
  description = "Producto", 
  price = "$450", 
  src = "sadasd.jpg", 
  onNavigate, 
  isFeatured = false // Por defecto, no es destacada
}: CardProps) {
  return (
    <Rectangle onClick={onNavigate} style={{ border: isFeatured ? '5px solid #dda90d' : '5px solid #000' }}> {/* Ejemplo de estilo diferente */}
      <ImageContainer>
        <Image src={src} />
      </ImageContainer>
      <OtherRectangle>
        <Description>{description}</Description>
        <Price>{price}</Price>
      </OtherRectangle>
    </Rectangle>
  );
}








