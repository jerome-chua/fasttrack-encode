import { NextResponse } from 'next/server'
import { validateSession, getSupabaseAdmin } from '@/lib/api/auth'

export async function GET(request: Request) {
  try {
    const auth = await validateSession(request)

    if (auth.error) {
      return auth.error
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '1d'

    const db = getSupabaseAdmin()

    // Calculate date range based on period
    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)

    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    let daysInPeriod = 1

    if (period === '7d') {
      startDate.setDate(startDate.getDate() - 6)
      daysInPeriod = 7
    } else if (period === '30d') {
      startDate.setDate(startDate.getDate() - 29)
      daysInPeriod = 30
    }

    const { data: foodLogs, error: logsError } = await db
      .from('food_logs')
      .select('calories, meal_type')
      .eq('telegram_id', auth.telegramId)
      .gte('logged_at', startDate.toISOString())
      .lte('logged_at', endDate.toISOString())

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

    // For periods > 1 day, calculate daily averages
    if (daysInPeriod > 1) {
      for (const mealType of Object.keys(caloriesByMealType)) {
        caloriesByMealType[mealType] = Math.round(caloriesByMealType[mealType] / daysInPeriod)
      }
      totalCalories = Math.round(totalCalories / daysInPeriod)
    }

    // Convert to array format for the pie chart
    const data = Object.entries(caloriesByMealType).map(([mealType, calories]) => ({
      mealType,
      calories,
      percentage: totalCalories > 0 ? Math.round((calories / totalCalories) * 100) : 0,
    }))

    return NextResponse.json({ data, totalCalories, period, daysInPeriod })
  } catch (error) {
    console.error('Error fetching calories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calories' },
      { status: 500 }
    )
  }
}
