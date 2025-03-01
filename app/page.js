import Authors from "@/components/Authors/Authors";
import Bestsellers from "@/components/Bestsellers/Bestsellers";
import Hero from "@/components/Hero/Hero";
import Newsletter from "@/components/Newsletter/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Bestsellers />
      <Newsletter />
      <Authors />
    </>
  );
}
