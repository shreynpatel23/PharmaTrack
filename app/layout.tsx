import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserContext } from "@/context/userContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PharmaTrack",
  description:
    "PharmaTrack is a cutting-edge inventory management system designed specifically for medical shops and pharmacies. This powerful tool streamlines your inventory processes, ensuring you never run out of essential medications and supplies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background`}>
        <UserContext>{children}</UserContext>
      </body>
    </html>
  );
}
