import type { Route } from "./+types/layout";
import { BeerProviders, Button } from "@siemsiem/beerreact"
import "beercss";
import "material-dynamic-colors";
import Home from "./home"

export default function Layout() {
  return <main style={{
    margin: "0",
    padding: "0"
  }}>
    <BeerProviders>
      <Home></Home>
    </BeerProviders>
  </main>;
}
