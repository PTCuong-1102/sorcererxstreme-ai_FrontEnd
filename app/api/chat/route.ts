import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sql } from '@/lib/db';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const result = await model.generateContent(message);
    const text = result.response.text();

    await sql`CREATE TABLE IF NOT EXISTS chat_messages (id SERIAL PRIMARY KEY, user_message TEXT, ai_response TEXT)`;
    await sql`INSERT INTO chat_messages (user_message, ai_response) VALUES (${message}, ${text})`;

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
