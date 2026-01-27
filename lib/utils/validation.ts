import { MealType } from "../types";

// Check if text looks like a login code (8 alphanumeric characters)
export function isLoginCode(text: string): boolean {
  return /^[A-Z0-9]{8}$/i.test(text);
}

export interface ValidationResult {
  valid: boolean;
  value?: number;
  error?: string;
}

// Validate a number from text input
export function validateNumber(
  text: string,
  min?: number,
  max?: number
): ValidationResult {
  const num = parseFloat(text);

  if (isNaN(num) || num <= 0) {
    return { valid: false, error: "Please enter a valid positive number." };
  }

  if (min !== undefined && num < min) {
    return { valid: false, error: `Please enter a number greater than or equal to ${min}.` };
  }

  if (max !== undefined && num > max) {
    return { valid: false, error: `Please enter a number less than or equal to ${max}.` };
  }

  return { valid: true, value: num };
}

// Validate weight (20-300 kg)
export function validateWeight(weight: number): { valid: boolean; error?: string } {
  if (weight < 20 || weight > 300) {
    return { valid: false, error: "Please enter a weight between 20 and 300 kg." };
  }
  return { valid: true };
}

// Validate height (100-250 cm)
export function validateHeight(height: number): { valid: boolean; error?: string } {
  if (height < 100 || height > 250) {
    return { valid: false, error: "Please enter a height between 100 and 250 cm." };
  }
  return { valid: true };
}

export function getMealTypeByTime(date: Date = new Date()): MealType {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  // Convert time ranges to minutes for easier comparison
  const BREAKFAST_START = 4 * 60 + 1;   // 4:01am = 241
  const LUNCH_START = 11 * 60;          // 11:00am = 660
  const SNACK_START = 15 * 60;          // 3:00pm = 900
  const DINNER_START = 17 * 60 + 30;    // 5:30pm = 1050
  const SUPPER_START = 22 * 60 + 30;    // 10:30pm = 1350

  if (timeInMinutes >= BREAKFAST_START && timeInMinutes < LUNCH_START) {
    return "breakfast";
  } else if (timeInMinutes >= LUNCH_START && timeInMinutes < SNACK_START) {
    return "lunch";
  } else if (timeInMinutes >= SNACK_START && timeInMinutes < DINNER_START) {
    return "snack";
  } else if (timeInMinutes >= DINNER_START && timeInMinutes < SUPPER_START) {
    return "dinner";
  } else {
    return "supper";
  }
}
