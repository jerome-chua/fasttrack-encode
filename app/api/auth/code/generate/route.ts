import { createClient, SupabaseClient } from '@supabase/supabase-js'
import crypto from 'crypto'
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

// Generate a random 8-character alphanumeric code
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing chars: 0,O,1,I
  let code = ''
  const randomBytes = crypto.randomBytes(8)
  for (let i = 0; i < 8; i++) {
    code += chars[randomBytes[i] % chars.length]
  }
  return code
}

export async function POST() {
  try {
    const db = getSupabase()

    // Generate unique code
    let code = generateCode()
    let attempts = 0
    const maxAttempts = 5

    // Ensure code is unique
    while (attempts < maxAttempts) {
      const { data: existing } = await db
        .from('login_codes')
        .select('id')
        .eq('code', code)
        .eq('status', 'pending')
        .single()

      if (!existing) break

      code = generateCode()
      attempts++
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: 'Failed to generate unique code' },
        { status: 500 }
      )
    }

    // Set expiration to 5 minutes from now
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000)

    // Create login code record
    const { data, error } = await db
      .from('login_codes')
      .insert({
        code,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      })
      .select('id, code, expires_at')
      .single()

    if (error) {
      console.error('Error creating login code:', error)
      return NextResponse.json(
        { error: 'Failed to create login code' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      code: data.code,
      expiresAt: data.expires_at,
    })
  } catch (error) {
    console.error('Generate code error:', error)
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    )
  }
}
