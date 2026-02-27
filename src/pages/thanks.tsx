import { FucsiaButton } from "@/ui/buttons"
import { useRouter } from "next/router";
import { TitleCentrado } from "@/ui/typography";
export default function Thankspage(){
  const router= useRouter()

  function handleGoHome(){
    router.push("/")
  }

  return(<div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "30px"}}>
    <TitleCentrado>Gracias por comprar en nuestra tienda!!</TitleCentrado>
    <FucsiaButton onClick={handleGoHome}>Volver al inicio</FucsiaButton>
  </div>
  )
}