import crypto from "crypto";
import { getUser, createUser, supabase } from "../supabase";

export interface VerifyLoginCodeResult {
  success: boolean;
  error?: string;
}

// Verify and process login code
export async function verifyLoginCode(
  code: string,
  telegramId: number,
  firstName: string
): Promise<VerifyLoginCodeResult> {
  try {
    // Find the login code
    const { data: loginCode, error: findError } = await supabase
      .from("login_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("status", "pending")
      .single();

    if (findError || !loginCode) {
      return { success: false, error: "Invalid or expired code" };
    }

    // Check if expired
    if (new Date(loginCode.expires_at) < new Date()) {
      await supabase
        .from("login_codes")
        .update({ status: "expired" })
        .eq("id", loginCode.id);
      return { success: false, error: "Code has expired" };
    }

    // Check attempts (max 3)
    if (loginCode.attempts >= 3) {
      await supabase
        .from("login_codes")
        .update({ status: "expired" })
        .eq("id", loginCode.id);
      return { success: false, error: "Too many attempts" };
    }

    // Ensure user exists
    let user = await getUser(telegramId);
    if (!user) {
      user = await createUser(telegramId, firstName);
    }

    if (!user) {
      return { success: false, error: "Failed to create user" };
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create session
    const { error: sessionError } = await supabase.from("sessions").insert({
      telegram_id: telegramId,
      token: sessionToken,
      expires_at: expiresAt.toISOString(),
    });

    if (sessionError) {
      console.error("Error creating session:", sessionError);
      return { success: false, error: "Failed to create session" };
    }

    // Update login code as verified
    const { error: updateError } = await supabase
      .from("login_codes")
      .update({
        telegram_id: telegramId,
        session_token: sessionToken,
        status: "verified",
      })
      .eq("id", loginCode.id);

    if (updateError) {
      console.error("Error updating login code:", updateError);
      return { success: false, error: "Failed to verify code" };
    }

    return { success: true };
  } catch (error) {
    console.error("Login code verification error:", error);
    return { success: false, error: "Verification failed" };
  }
}
