import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Lazy-initialize Supabase client with service role key for API routes
let supabase: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
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

export interface AuthResult {
  telegramId: number
  error?: never
}

export interface AuthError {
  telegramId?: never
  error: NextResponse
}

/**
 * Validates the session token from the Authorization header.
 * Returns the telegram_id if valid, or an error response if invalid.
 */
export async function validateSession(request: Request): Promise<AuthResult | AuthError> {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      ),
    }
  }

  const token = authHeader.substring(7)
  const db = getSupabaseAdmin()

  const { data: session, error: sessionError } = await db
    .from('sessions')
    .select('telegram_id')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (sessionError || !session) {
    return {
      error: NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      ),
    }
  }

  return { telegramId: session.telegram_id }
}
