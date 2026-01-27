import { NextResponse } from 'next/server'
import { validateSession, getSupabaseAdmin } from '@/lib/api/auth'

export async function GET(request: Request) {
  try {
    const auth = await validateSession(request)

    if (auth.error) {
      return auth.error
    }

    const db = getSupabaseAdmin()

    // Get today's food logs
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const { data: foodLogs, error: logsError } = await db
      .from('food_logs')
      .select('calories, meal_type')
      .eq('telegram_id', auth.telegramId)
      .gte('logged_at', startOfDay.toISOString())
      .lte('logged_at', endOfDay.toISOString())

    if (logsError) {
      console.error('Error fetching food logs:', logsError)
      return NextResponse.json(
        { error: 'Failed to fetch food logs' },
        { status: 500 }
      )
    }

    // Aggregate calories by meal type
    const caloriesByMealType: Record<string, number> = {}
    let totalCalories = 0

    for (const log of foodLogs || []) {
      const mealType = log.meal_type || 'other'
      caloriesByMealType[mealType] = (caloriesByMealType[mealType] || 0) + (log.calories || 0)
      totalCalories += log.calories || 0
    }

    // Convert to array format for the pie chart
    const data = Object.entries(caloriesByMealType).map(([mealType, calories]) => ({
      mealType,
      calories,
      percentage: totalCalories > 0 ? Math.round((calories / totalCalories) * 100) : 0,
    }))

    return NextResponse.json({ data, totalCalories })
  } catch (error) {
    console.error('Error fetching calories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calories' },
      { status: 500 }
    )
  }
}
