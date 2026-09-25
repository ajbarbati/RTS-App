"use server";

import { redirect } from "next/navigation";
import { EmailTakenError, signup } from "@/src/lib/auth/signup";
import { ValidationError } from "@/src/lib/auth/validation";

export type SignUpState = { error: string | null };

export async function signUpAction(
  _prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  try {
    await signup(formData.get("email"), formData.get("password"));
  } catch (error) {
    if (error instanceof ValidationError || error instanceof EmailTakenError) {
      return { error: error.message };
    }
    throw error;
  }

  redirect("/login?registered=1");
}
