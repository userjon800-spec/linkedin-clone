import { getUsersServer } from "@/lib/request.server";
import dynamic from "next/dynamic";
const Skeleton = dynamic(() => import("@/components/shared/linkedin-skeleton"));
const ManageMyNetwork = dynamic(
  () => import("@/components/shared/manage-my-network"),
);
const LinkedInFooter = dynamic(
  () => import("@/components/shared/linkedin-footer"),
);
const SuggestionsUsers = dynamic(
  () => import("@/components/shared/suggestions-users"),
);
export default async function Page() {
  const data = await getUsersServer();
  if (!data) {
    return <Skeleton />;
  }
  return (
    <div className="w-full flex mt-4 gap-3">
      <div className="w-[25%] h-fit flex flex-col gap-3">
        <ManageMyNetwork user={data.user} />
        <LinkedInFooter />
      </div>
      <div className="w-[70%] h-fit flex flex-col gap-3">
        <SuggestionsUsers />
      </div>
    </div>
  );
}
