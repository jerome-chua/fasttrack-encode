-- Add 'supper' to the allowed meal_type values
ALTER TABLE food_logs DROP CONSTRAINT IF EXISTS food_logs_meal_type_check;
ALTER TABLE food_logs ADD CONSTRAINT food_logs_meal_type_check
  CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'supper'));
