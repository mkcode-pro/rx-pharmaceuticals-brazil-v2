import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/store/cart-context";
import { AuthProvider } from "@/store/auth-context";
import AddToCartModal from "@/components/cart/add-to-cart-modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rx Pharmaceuticals Brazil - Alta Performance em Evidência",
  description: "Evolua com inteligência e consistência. Qualidade internacional de matéria prima com o mais moderno em tecnologia aplicada.",
  icons: {
    icon: "/images/logo-small.png",
    apple: "/images/logo-small.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {children}
            <AddToCartModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
