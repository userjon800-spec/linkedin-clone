import { getUsersServer } from "@/lib/request.server";
import dynamic from "next/dynamic";
const LeftMenuBar = dynamic(() => import("@/components/shared/left-menu-bar"));
const StartPost = dynamic(() => import("@/components/shared/start-add-post"));
const Puzzles = dynamic(() => import("@/components/shared/puzzles"));
const PostCards = dynamic(() => import("@/components/shared/post-cards"));
const AddedFeed = dynamic(() => import("@/components/shared/added-feed"));
const Skeleton = dynamic(() => import("@/components/shared/linkedin-skeleton"));
export default async function Page() {
  const data = await getUsersServer();
  if (!data) {
    return <Skeleton />;
  }
  return (
    <div className="w-full h-fit py-2 mt-2.5 flex gap-2.5 px-1 justify-between">
      <LeftMenuBar user={data?.user} />
      <div className="w-[55%]">
        <StartPost user={data?.user} />
        <PostCards />
      </div>
      <div className="w-[25%]">
        <AddedFeed userId={data?.user._id} />
        <Puzzles />
      </div>
    </div>
  );
}
