import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinkedIn Clone",
  description: "It's linkedin clone created by me",
  icons:{
    icon:"https://pngimg.com/uploads/linkedIn/linkedIn_PNG27.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
