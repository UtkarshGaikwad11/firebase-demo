import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "User Management Dashboard",
  description: "Manage users securely with Firebase and Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <div className="w-full border-b border-white/20 bg-white/50 backdrop-blur-sm shadow-sm">
              <div className="max-w-7xl mx-auto py-4 px-4">
                <Header title="User Management Dashboard" />
              </div>
            </div>
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}