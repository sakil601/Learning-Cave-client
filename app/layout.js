import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { AuthProvider } from "@/components/AuthProvider";
import { WishlistProvider } from "@/components/WishlistProvider";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://learningcave.com.bd"),
  title: {
    default: "Learning Cave — Learn More, Grow More",
    template: "%s — Learning Cave",
  },
  description: "Practical Microsoft Office, data and productivity learning from Learning Cave.",
};

const themeScript = `(function(){try{var t=localStorage.getItem("lc_theme");if(t!=="dark")t="light";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;600;700;800;900&family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <WishlistProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <FloatingContact />
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
