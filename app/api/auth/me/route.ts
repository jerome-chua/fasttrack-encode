import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

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

export async function GET(request: Request) {
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

    // Find valid session
    const { data: session, error: sessionError } = await db
      .from('sessions')
      .select('*')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    // Get user data
    const { data: user, error: userError } = await db
      .from('users')
      .select('*')
      .eq('telegram_id', session.telegram_id)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        telegram_id: user.telegram_id,
        first_name: user.first_name,
        current_weight: user.current_weight,
        goal_weight: user.goal_weight,
        height: user.height,
        onboarding_step: user.onboarding_step,
      },
      session: {
        expires_at: session.expires_at,
      },
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
