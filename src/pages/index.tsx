import Hub from "@/components/Hub";
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();
    const rawQuery = router.query.q || ""; // o 'q' si usás ?q= en la URL
    const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;
  return (
    <Hub query={query}></Hub>
  );
}
