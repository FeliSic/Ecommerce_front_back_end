import styled from "styled-components";
import { ISOLogo, TotalLogo } from "../logo";
import { FucsiaButton, YellowButton } from "../buttons";
import { Body } from "../typography";
import { Input, Label } from "../text-field";
import Link from "next/link";
import { useEffect, useState } from "react";

const HeaderRectangle = styled.header`
  width:100vw;
  height: 84px;
  background-color: #000;
  position: sticky; /* Fijo en la parte superior */

`

const ContainerHeaderButton = styled.div`
  display: flex; /* Usar flexbox */
  flex-direction: row;
  justify-content: space-between; /* Espacio entre los elementos */
  align-items: center; /* Centrar verticalmente */
  margin-left: 20px;
  height: 100%; /* Asegúrate de que ocupe toda la altura del header */


  @media (min-width: 768px) {
    /* Ocultar el botón de hamburguesa y el logo del carrito */
    .hamburger,
    .cart-logo {
      display: none;
    }
    .fucsia-button,
    .total-logo {
      display: flex; /* O cualquier otra propiedad que necesites */
    }
  }
        @media (max-width: 768px) {
    /* Ocultar el botón de hamburguesa y el logo del carrito */
    .fucsia-button,
    .total-logo {
      display: none; /* O cualquier otra propiedad que necesites */
    }
  }
  
`
const MiniRectangle = styled.div`
  width: 52px;
  height: 8px;
  margin: 2px 0;
  background-color: #fff;
`
const HeaderButton = styled(FucsiaButton)``

const ContainerHamburger = styled(ContainerHeaderButton)`
  flex-direction: column;
  justify-content: center; /* Espacio entre los elementos */
  align-items: end; /* Centrar verticalmente */
  margin-right: 40px;
  height: 100%; /* Asegúrate de que ocupe toda la altura del header */
`

export const BusquedaHeader = styled(Input)`
  padding: 0 40px;
  background-color: transparent;
  border-color: #fff;
  color: #fff;
  width: 100%;
`;

export const BusquedaHeaderButt = styled(YellowButton)`
  padding: 0 5px;
  width: 100%;
`

export const SearcherContainer = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    display: none;
  }
`;


export function HeaderSearcher({ handleSearchClick, searchValue, onSearchChange }: { handleSearchClick: (query: string) => void; searchValue: string; onSearchChange: (value: string) => void; }) {
  return (
    <SearcherContainer>
      <BusquedaHeader 
        placeholder="Buscar productos..." 
        value={searchValue} // Asignar el valor del input
        onChange={(e) => onSearchChange(e.target.value)} // Manejar el cambio del input
      />
      <BusquedaHeaderButt onClick={() => handleSearchClick(searchValue)}>BUSCAR</BusquedaHeaderButt>
    </SearcherContainer>
  );
}




export function HeaderUi({ children, toggleMenu, menuOpen, user, handleLogout, windowWidth }: { children: React.ReactNode; toggleMenu: () => void; menuOpen: boolean; user?: any, handleLogout: (href: string) => void, windowWidth: number }) {
  return (
    <HeaderRectangle>
      <ContainerHeaderButton>
        <Link href="/">
        <ISOLogo  className="cart-logo"/> {/* Logo completo */}
        <TotalLogo className="total-logo"></TotalLogo>
        </Link>
        {children}
        <ContainerHamburger onClick={() => {
            if (windowWidth < 768) toggleMenu();
        }}>
          <div className="hamburger">
            <MiniRectangle />
            <MiniRectangle />
            <MiniRectangle />
          </div>
          {user ? (
            <>
              <div style={{ display: windowWidth < 768 ? 'none' : 'flex', flexDirection: 'column', marginTop: '-20px' }}>
                <UserEmail>{user.email}</UserEmail> {/* Muestra el email del usuario */}
                <LogoutButton onClick={() => handleLogout("/")}>Cerrar Sesión</LogoutButton>
              </div>
            </>
          ) : (
            <Link href="/ingresar" style={{ textDecoration: 'none' }}>
              <HeaderButton className="fucsia-button">INGRESAR</HeaderButton>
            </Link>
          )}
        </ContainerHamburger>
      </ContainerHeaderButton>
    </HeaderRectangle>
  );
}


export const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000; /* Fondo negro semi-transparente */
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  justify-content: center;
  z-index: 999; /* Asegúrate de que esté por encima de otros elementos */
`;



const StyledMenuItem = styled(Link)`
  color: #fff;
  text-decoration: none;
  margin: 20px 0;
  font-size: 50px;
  cursor: pointer;
`;

export const MenuItem = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
  return (
    <StyledMenuItem href={href} onClick={onClick}>
      {children}
    </StyledMenuItem>
  );
};

export const UserEmail = styled.div`
  color: #fff;
  margin: 20px 0;
  font-size: 18px;
`;

export const LogoutButton = styled.button`
  background-color: transparent;
  color: #fff;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
`;





// ----------------------------------------------------------------------------------------------------------------------------------------------------
const FooterRectangle = styled.footer`
  width:100vw;
  background-color: #000;
  display: flex;
  flex-wrap: wrap;
  padding: 50px;
  gap: 20px;
  bottom: 0;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;


  @media (min-width: 768px) {
    max-width: 40%;
  }
`;

const RedesLabel = styled(Label)`
  display: flex;
  flex-direction: column;
  color: #fff;
  gap: 20px;
  font-size: 25px;
  flex: 1;
`;



const License = styled(Body)`
  color: #fff;
  width: 100%;
  margin-top: auto; /* Para que quede abajo en desktop */
  

  @media (min-width: 768px) {
    margin-top: 50px;
  }
`


const Ingresar = styled(Link)`
  color: #fff;
  margin-bottom: 30px;
  `;

const Search = styled(Ingresar)`
`;
const MyProfile = styled(Ingresar)``;

const Logout = styled(Ingresar)`
  color: #fff;
  margin-bottom: 30px;
`;
const Link1 = styled.a`
  color: #fff;
  font-size: 16px;
  margin: 5px;
`;
const Link2 = styled(Link1)`
  color: #fff;
  margin-bottom: 30px;
`;

export function Footer() {
  return (
    <FooterRectangle>
      <OptionsContainer>
        <Ingresar href="/ingresar">Ingresar</Ingresar>
        <MyProfile href="/perfil">Mi perfil</MyProfile>
        <Search href="/buscador">Buscar</Search>
        <Logout href="/">Logout</Logout>
      </OptionsContainer>
      <label style={{alignItems: "end"}}>
      <RedesLabel>
        Redes
        <Link1 href="https://www.google.com">My E-commerce</Link1>
        <Link2 href="https://www.youtube.com">My E-commerce</Link2>
      </RedesLabel>
      </label>
      <License>@2026 Licensed</License>
    </FooterRectangle>
  );
}


