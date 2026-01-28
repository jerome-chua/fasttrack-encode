export type MealType = "breakfast" | "lunch" | "snack" | "dinner" | "supper";

export interface User {
  telegram_id: number;
  first_name: string;
  current_weight: number | null;
  goal_weight: number | null;
  height: number | null;
  timezone: string;
  onboarding_step: "weight" | "goal" | "height" | "timezone" | "completed";
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
  meal_type: MealType | "beverage" | null;
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
