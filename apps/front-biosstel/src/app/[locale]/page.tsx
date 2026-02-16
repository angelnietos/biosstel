import Image from "next/image";
import background from "../../../public/images/background.png";
import logo from "../../../public/images/logo.png";
import { MainContainer } from "@biosstel/ui-layout";

export default function LoginPage() {
  return (
    <main className="mx-auto flex h-screen w-full max-w-7xl p-4">
      <section className="relative flex h-full w-full items-center justify-center">
        <Image
          src={logo}
          alt="Biosstel"
          className="absolute left-4 top-4 md:left-8 md:top-8"
          width={100}
          height={32}
        />
        <MainContainer />
      </section>

      <aside className="relative hidden h-full w-full md:block">
        <Image
          src={background}
          alt="Login image"
          fill
          className="rounded-20 object-cover"
        />
      </aside>
    </main>
  );
}
