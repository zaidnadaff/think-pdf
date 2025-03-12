import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { JSX, ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body>
        <Toaster
          toastOptions={{
            classNames: {
              error: "bg-red-400 border-red-600",
              success: "text-green-400 border-green-600",
              warning: "text-yellow-400 border-yellow-600",
              info: "bg-blue-400 border-blue-600",
            },
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
