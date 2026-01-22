import { createClient, SupabaseClient } from '@supabase/supabase-js'
import crypto from 'crypto'
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

interface TelegramAuthData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

function verifyTelegramAuth(data: TelegramAuthData, botToken: string): boolean {
  const { hash, ...rest } = data

  // Create check string from sorted key=value pairs
  const checkArr = Object.keys(rest)
    .sort()
    .filter(key => rest[key as keyof typeof rest] !== undefined)
    .map(key => `${key}=${rest[key as keyof typeof rest]}`)
  const checkString = checkArr.join('\n')

  // Create secret key from bot token using SHA256
  const secretKey = crypto
    .createHash('sha256')
    .update(botToken)
    .digest()

  // Calculate HMAC-SHA256
  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex')

  return hmac === hash
}

export async function POST(request: Request) {
  try {
    const telegramUser: TelegramAuthData = await request.json()

    // Verify the data is actually from Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (!verifyTelegramAuth(telegramUser, botToken)) {
      return NextResponse.json(
        { error: 'Invalid authentication data' },
        { status: 401 }
      )
    }

    // Check auth isn't too old (within 1 day)
    const authAge = Date.now() / 1000 - telegramUser.auth_date
    if (authAge > 86400) {
      return NextResponse.json(
        { error: 'Authentication expired' },
        { status: 401 }
      )
    }

    const db = getSupabase()

    // Check if user exists in the users table (from Telegram bot onboarding)
    const { data: existingUser } = await db
      .from('users')
      .select('*')
      .eq('telegram_id', telegramUser.id)
      .single()

    let user = existingUser

    // If user doesn't exist, create a basic record
    // (They can complete full onboarding via the Telegram bot)
    if (!user) {
      const { data: newUser, error: createError } = await db
        .from('users')
        .insert({
          telegram_id: telegramUser.id,
          first_name: telegramUser.first_name,
          onboarding_step: 'weight', // Will complete via Telegram bot
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        )
      }

      user = newUser
    }

    // Generate a session token
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Store session in database
    const { error: sessionError } = await db
      .from('sessions')
      .insert({
        telegram_id: telegramUser.id,
        token: sessionToken,
        expires_at: expiresAt.toISOString(),
      })

    if (sessionError) {
      console.error('Error creating session:', sessionError)
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    // Return user data and session token
    return NextResponse.json({
      user: {
        telegram_id: user.telegram_id,
        first_name: user.first_name,
        username: telegramUser.username,
        photo_url: telegramUser.photo_url,
        onboarding_step: user.onboarding_step,
      },
      token: sessionToken,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
