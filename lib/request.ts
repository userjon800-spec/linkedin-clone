import { IUser } from "@/types";
import api from "./api";
export async function getUsers() {
  return api.get<{ success: boolean; user: IUser }>(`/api/me`);
}
