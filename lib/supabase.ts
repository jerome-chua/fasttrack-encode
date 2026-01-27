import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// Types
// ============================================================================

export interface User {
  telegram_id: number;
  first_name: string;
  current_weight: number | null;
  goal_weight: number | null;
  height: number | null;
  onboarding_step: "weight" | "goal" | "height" | "completed";
  created_at: string;
  updated_at: string;
}

export interface WeightLog {
  id: number;
  telegram_id: number;
  weight: number;
  logged_at: string;
}

export interface FastingPeriod {
  id: number;
  telegram_id: number;
  started_at: string;
  ended_at: string | null;
}

export interface FoodItem {
  name: string;
  calories: number;
  portion: string;
}

export interface FoodLog {
  id: number;
  telegram_id: number;
  image_url: string | null;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  food_items: FoodItem[] | null;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack" | "beverage" | "supper" | null;
  notes: string | null;
  logged_at: string;
}

export interface DailySummary {
  id: number;
  telegram_id: number;
  summary_date: string;
  total_calories: number | null;
  total_protein: number | null;
  total_carbs: number | null;
  total_fat: number | null;
  fasting_hours: number | null;
  ai_summary: string | null;
  created_at: string;
}

// ============================================================================
// User Functions
// ============================================================================

export async function getUser(telegramId: number): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user:", error);
  }
  return data;
}

export async function createUser(telegramId: number, firstName: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .insert({
      telegram_id: telegramId,
      first_name: firstName,
      onboarding_step: "weight",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    return null;
  }
  return data;
}

export async function updateUser(
  telegramId: number,
  updates: Partial<Pick<User, "current_weight" | "goal_weight" | "height" | "onboarding_step">>
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("telegram_id", telegramId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    return null;
  }
  return data;
}

// ============================================================================
// Weight Log Functions
// ============================================================================

export async function logWeight(telegramId: number, weight: number): Promise<WeightLog | null> {
  const { data, error } = await supabase
    .from("weight_logs")
    .insert({
      telegram_id: telegramId,
      weight,
    })
    .select()
    .single();

  if (error) {
    console.error("Error logging weight:", error);
    return null;
  }
  return data;
}

export async function getWeightHistory(telegramId: number, limit = 90): Promise<WeightLog[]> {
  const { data, error } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("telegram_id", telegramId)
    .order("logged_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching weight history:", error);
    return [];
  }
  return data || [];
}

// ============================================================================
// Fasting Period Functions
// ============================================================================

export async function startFast(telegramId: number): Promise<FastingPeriod | null> {
  const { data, error } = await supabase
    .from("fasting_periods")
    .insert({
      telegram_id: telegramId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error starting fast:", error);
    return null;
  }
  return data;
}

export async function endFast(telegramId: number): Promise<FastingPeriod | null> {
  // Find the active fast (ended_at is null)
  const { data: activeFast, error: findError } = await supabase
    .from("fasting_periods")
    .select("*")
    .eq("telegram_id", telegramId)
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  if (findError && findError.code !== "PGRST116") {
    console.error("Error finding active fast:", findError);
    return null;
  }

  if (!activeFast) {
    return null; // No active fast to end
  }

  // End the fast
  const { data, error } = await supabase
    .from("fasting_periods")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", activeFast.id)
    .select()
    .single();

  if (error) {
    console.error("Error ending fast:", error);
    return null;
  }
  return data;
}

export async function getActiveFast(telegramId: number): Promise<FastingPeriod | null> {
  const { data, error } = await supabase
    .from("fasting_periods")
    .select("*")
    .eq("telegram_id", telegramId)
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching active fast:", error);
  }
  return data || null;
}

export async function getFastingHistory(telegramId: number, limit = 30): Promise<FastingPeriod[]> {
  const { data, error } = await supabase
    .from("fasting_periods")
    .select("*")
    .eq("telegram_id", telegramId)
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching fasting history:", error);
    return [];
  }
  return data || [];
}

// ============================================================================
// Food Log Functions
// ============================================================================

export interface CreateFoodLogInput {
  telegram_id: number;
  image_url?: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  food_items?: FoodItem[];
  meal_type?: FoodLog["meal_type"];
  notes?: string;
}

export async function createFoodLog(input: CreateFoodLogInput): Promise<FoodLog | null> {
  const { data, error } = await supabase
    .from("food_logs")
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error("Error creating food log:", error);
    return null;
  }
  return data;
}

export async function getFoodLogs(telegramId: number, limit = 50): Promise<FoodLog[]> {
  const { data, error } = await supabase
    .from("food_logs")
    .select("*")
    .eq("telegram_id", telegramId)
    .order("logged_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching food logs:", error);
    return [];
  }
  return data || [];
}

export async function getFoodLogsForDate(telegramId: number, date: Date): Promise<FoodLog[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("food_logs")
    .select("*")
    .eq("telegram_id", telegramId)
    .gte("logged_at", startOfDay.toISOString())
    .lte("logged_at", endOfDay.toISOString())
    .order("logged_at", { ascending: true });

  if (error) {
    console.error("Error fetching food logs for date:", error);
    return [];
  }
  return data || [];
}

// ============================================================================
// Daily Summary Functions
// ============================================================================

export interface UpsertDailySummaryInput {
  telegram_id: number;
  summary_date: string;
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  fasting_hours?: number;
  ai_summary?: string;
}

export async function upsertDailySummary(input: UpsertDailySummaryInput): Promise<DailySummary | null> {
  const { data, error } = await supabase
    .from("daily_summaries")
    .upsert(input, { onConflict: "telegram_id,summary_date" })
    .select()
    .single();

  if (error) {
    console.error("Error upserting daily summary:", error);
    return null;
  }
  return data;
}

export async function getDailySummary(telegramId: number, date: string): Promise<DailySummary | null> {
  const { data, error } = await supabase
    .from("daily_summaries")
    .select("*")
    .eq("telegram_id", telegramId)
    .eq("summary_date", date)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching daily summary:", error);
  }
  return data || null;
}

export async function getDailySummaries(telegramId: number, limit = 30): Promise<DailySummary[]> {
  const { data, error } = await supabase
    .from("daily_summaries")
    .select("*")
    .eq("telegram_id", telegramId)
    .order("summary_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching daily summaries:", error);
    return [];
  }
  return data || [];
}

// ============================================================================
// Session Functions (for web authentication)
// ============================================================================

export interface Session {
  id: number;
  telegram_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

export async function getSessionByToken(token: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching session:", error);
  }
  return data || null;
}

export async function getUserBySessionToken(token: string): Promise<User | null> {
  const session = await getSessionByToken(token);
  if (!session) return null;

  return getUser(session.telegram_id);
}

export async function deleteSession(token: string): Promise<boolean> {
  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("token", token);

  if (error) {
    console.error("Error deleting session:", error);
    return false;
  }
  return true;
}

export async function deleteUserSessions(telegramId: number): Promise<boolean> {
  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("telegram_id", telegramId);

  if (error) {
    console.error("Error deleting user sessions:", error);
    return false;
  }
  return true;
}
