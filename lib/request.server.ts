import "server-only"; // Client component'da import qilinsa darhol xato beradi
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import api from "./api";
import { IUser } from "@/types";
export async function getUsersServer() {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    const response = await api.get<{ success: boolean; user: IUser }>("/api/me", {
      headers: {
        Cookie: cookieString,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      redirect("/auth/signin");
    }
    console.error("getUsersServer error:", error);
    return null;
  }
} 