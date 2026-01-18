// Types
export interface WeightData {
  date: Date;
  weight: number;
  movingAverage: number | null;
}

// Mock configuration constants
export const GOAL_WEIGHT = 75; // kg
export const START_WEIGHT = 85; // kg
export const DAYS_TO_GENERATE = 90;

// Generate mock data (last 90 days)
export function generateMockData(): WeightData[] {
  const data: WeightData[] = [];
  const today = new Date();

  for (let i = DAYS_TO_GENERATE - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate gradual weight loss with daily fluctuations
    const trend = START_WEIGHT - ((DAYS_TO_GENERATE - 1 - i) / (DAYS_TO_GENERATE - 1)) * (START_WEIGHT - GOAL_WEIGHT) * 0.6;
    const fluctuation = (Math.random() - 0.5) * 1.5;
    const weight = Math.round((trend + fluctuation) * 10) / 10;

    data.push({
      date,
      weight,
      movingAverage: null,
    });
  }

  // Calculate 7-day moving average
  for (let i = 6; i < data.length; i++) {
    const sum = data.slice(i - 6, i + 1).reduce((acc, d) => acc + d.weight, 0);
    data[i].movingAverage = Math.round((sum / 7) * 10) / 10;
  }

  return data;
}
