import dynamic from "next/dynamic";
const Page = dynamic(() => import("@/components/auth/signup"));
export default function Pages() {
  return <Page />;
}