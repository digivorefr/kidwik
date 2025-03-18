import type { Metadata } from "next";
import { Playwrite_IT_Moderna, Itim, Poppins } from "next/font/google";
import "./globals.css";

// Import layout components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const playwriteITModerna = Playwrite_IT_Moderna({
  variable: "--font-playwrite-it-moderna",
  weight: ["400"],
});

const itim = Itim({
  variable: "--font-itim",
  subsets: ["latin"],
  weight: ["400"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "kidwik - Calendrier visuel personnalisable pour enfants",
  description: "Créez des calendriers hebdomadaires personnalisés avec des gommettes détachables pour aider les enfants à se repérer dans le temps.",
  icons: {
    icon: [
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${playwriteITModerna.variable} ${itim.variable} ${poppins.variable} antialiased bg-white flex flex-col min-h-screen`}
      >
        <Header />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
