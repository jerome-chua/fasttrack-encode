import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Bot } from 'grammy'

// Lazy-initialize Supabase client to avoid build-time errors
let supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error('Missing Supabase environment variables')
    }

    supabase = createClient(url, key)
  }
  return supabase
}

// Send logout notification via Telegram
async function sendLogoutNotification(telegramId: number): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN not set, skipping logout notification')
    return
  }

  try {
    const bot = new Bot(token)
    await bot.api.sendMessage(
      telegramId,
      "👋 You've been logged out from the FastTrack web dashboard.\n\nTo access the dashboard again, use /start and request a new login code."
    )
  } catch (error) {
    console.error('Error sending logout notification:', error)
    // Don't throw - logout should still succeed even if notification fails
  }
}

export async function POST(request: Request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const db = getSupabase()

    // First, get the session to retrieve telegram_id
    const { data: session, error: fetchError } = await db
      .from('sessions')
      .select('telegram_id')
      .eq('token', token)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching session:', fetchError)
    }

    // Delete the session
    const { error } = await db
      .from('sessions')
      .delete()
      .eq('token', token)

    if (error) {
      console.error('Error deleting session:', error)
      return NextResponse.json(
        { error: 'Failed to logout' },
        { status: 500 }
      )
    }

    // Send logout notification via Telegram (non-blocking)
    if (session?.telegram_id) {
      sendLogoutNotification(session.telegram_id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
