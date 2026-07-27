import { getUsersServer } from "@/lib/request.server";
import dynamic from "next/dynamic";
const LeftMenuBar = dynamic(() => import("@/components/shared/left_menu_bar"));
const StartPost = dynamic(() => import("@/components/shared/start_add_post"));
const Puzzles = dynamic(() => import("@/components/shared/puzzles"));
const PostCards = dynamic(() => import("@/components/shared/post_cards"));
const AddedFeed = dynamic(() => import("@/components/shared/added_feed"));
export default async function Page() {
  const data = await getUsersServer();
  return (
    <div className="w-full border h-fit py-2 mt-2.5 flex gap-2.5 px-1 justify-between">
      <LeftMenuBar user={data?.user} />
      <div className="w-[50%] border border-red-700">
        <StartPost />
        <PostCards />
      </div>
      <div className="w-[30%] border border-green-700">
        <AddedFeed />
        <Puzzles />
      </div>
    </div>
  );
}
