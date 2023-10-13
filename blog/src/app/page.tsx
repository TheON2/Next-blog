import Image from "next/image";
import { Open_Sans } from "next/font/google";

const sans = Open_Sans({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
