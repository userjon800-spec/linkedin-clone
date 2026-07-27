import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("@/components/shared/navbar"));
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Navbar />
      <div className="w-full max-w-370 mx-auto">{children}</div>
    </main>
  );
}
