import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { message, response, userId,emotionalScore } = await req.json()

  const { data, error } = await supabase
    .from('conversations')
    .insert([{ user_id: userId, message, response, emotional_score:emotionalScore }])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data[0])
}
