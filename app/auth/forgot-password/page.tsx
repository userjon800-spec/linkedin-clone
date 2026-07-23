import dynamic from "next/dynamic";
const Page = dynamic(() => import("@/components/auth/forgot-password"));
export default function Pages() {
  return <Page />;
}
