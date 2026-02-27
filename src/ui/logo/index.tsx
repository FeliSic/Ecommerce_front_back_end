import Logo from "./Logo.svg"
import LogoISO from "./shopping-cart.svg"
import LogoW from "./TotalLogoWhite.svg"
import LogoISOW from "./IsoIconWhite.svg"

export function TotalLogo(props:any) {
  return <img src={LogoW.src} {...props} alt="Total Logo" ></img>
}
export function ISOLogo(props:any) {
  return <img src={LogoISOW.src}  {...props} alt="ISO Logo"></img>
}




