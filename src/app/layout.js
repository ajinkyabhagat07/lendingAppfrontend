import Navbar from "@/components/Navbar";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Loan Application Platform",
  description: "A modern loan management platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 font-sans antialiased">
        <Navbar />

        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000, 
            style: {
              background: "#333", 
              color: "#fff", 
            },
          }}
        />
        <main className="container mx-auto px-8 py-12 max-w-screen-xl">
          {children}
        </main>
      </body>
    </html>
  );
}
