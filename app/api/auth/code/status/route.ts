import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

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
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      )
    }

    const db = getSupabase()

    // Find the login code
    const { data: loginCode, error } = await db
      .from('login_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (error || !loginCode) {
      return NextResponse.json(
        { status: 'invalid', error: 'Code not found' },
        { status: 404 }
      )
    }

    // Check if expired
    if (new Date(loginCode.expires_at) < new Date()) {
      // Mark as expired if not already
      if (loginCode.status === 'pending') {
        await db
          .from('login_codes')
          .update({ status: 'expired' })
          .eq('id', loginCode.id)
      }

      return NextResponse.json({
        status: 'expired',
      })
    }

    // If verified, return session data
    if (loginCode.status === 'verified' && loginCode.session_token) {
      // Get user data
      const { data: user } = await db
        .from('users')
        .select('*')
        .eq('telegram_id', loginCode.telegram_id)
        .single()

      // Get session expiry
      const { data: session } = await db
        .from('sessions')
        .select('expires_at')
        .eq('token', loginCode.session_token)
        .single()

      return NextResponse.json({
        status: 'verified',
        token: loginCode.session_token,
        expiresAt: session?.expires_at,
        user: user ? {
          telegram_id: user.telegram_id,
          first_name: user.first_name,
          current_weight: user.current_weight,
          goal_weight: user.goal_weight,
          height: user.height,
          onboarding_step: user.onboarding_step,
        } : null,
      })
    }

    // Still pending
    return NextResponse.json({
      status: 'pending',
      expiresAt: loginCode.expires_at,
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
