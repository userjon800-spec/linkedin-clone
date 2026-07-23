import dynamic from "next/dynamic";
const Page = dynamic(() => import("@/components/auth/signin"));
export default function Pages() {
  return <Page />;
}
// ssr false faqat client component uchun ishlatiladi server komponentlar uchun ishlatilmaydi