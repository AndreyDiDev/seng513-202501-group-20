// app/login/layout.tsx

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css"; // important for shared styles

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Login",
  description: "Login page for the app",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </div>
  );
}
