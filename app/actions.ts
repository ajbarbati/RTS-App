"use server";

import { signOut } from "@/src/lib/auth/auth";

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
