import type { AppProps } from 'next/app';
import "@/styles/base.css"; // Asegúrate de que este archivo contenga el CSS global
import { Header }from "@/components/header"; // Ajustá la ruta según donde esté tu Header
import { Footer } from "@/ui/layout/index"; // Ajustá la ruta según donde esté tu Footer

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
        <Component {...pageProps} />
      <Footer />
    </>
  );
}
