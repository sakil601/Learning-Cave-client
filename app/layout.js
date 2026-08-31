import "./globals.css";
import "./styles.css";
import { Lato } from "next/font/google";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
export const metadata = {
  title: "Learning Cave",
  description: "Courses, e-books and digital products",
};
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
});
export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lato.variable}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
