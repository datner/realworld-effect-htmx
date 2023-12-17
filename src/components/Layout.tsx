import { Html, PropsWithChildren } from "@kitajs/html";
import { Header } from "./Header.js";
import { Footer } from "./Footer.js";

export function Layout(props: PropsWithChildren) {
  return (
    <>
      <Header />
      <main>
      {props.children}
      </main>
      <Footer />
    </>
  );
}
