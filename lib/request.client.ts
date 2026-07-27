import { IUser } from "@/types";
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