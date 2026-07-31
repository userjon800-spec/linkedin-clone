import { IPost, IUser } from "@/types";
import api from "./api";
export async function getUsersClient() {
  try {
    const response = await api.get<{ success: boolean; user: IUser }>("/api/me");
    return response.data;
  } catch (error) {
    console.error("getUsersClient error:", error);
    return null;
  }
}
export async function getPosts() {
  try {
    const res = await api.get<{ success: boolean; posts: IPost[] }>("/api/posts");
    return res.data;
  } catch (error) {
    console.error("getUsersClient error:", error);
    return null;
  }
}