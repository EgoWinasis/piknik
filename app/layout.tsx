import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Satu Piknik, Banyak Bunga 🌷",
  description: "Sebuah ajakan piknik kecil dengan bunga, camilan, dan sedikit drama.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}