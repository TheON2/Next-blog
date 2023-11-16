import "./globals.css";
import { Open_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "./provider";

const sans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "TheBlog",
    template: "TheON2 | %s",
  },
  description: "프론트엔드 개발자 김도원의 블로그",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sans.className}>
      <body className="flex flex-col w-full mx-auto">
        <Providers>
          <Header />
          <main className="grow mx-4">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
