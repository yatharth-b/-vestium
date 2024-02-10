import { m } from 'framer-motion';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import OpenAI from 'openai';

const openai = new OpenAI();
 
export async function POST(req: NextRequest) {

  let messages_ = [];
  
  let data = await req.json();

  messages_ = data.messages

  const ai_response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages_,
  })

  return NextResponse.json({ message : ai_response.choices[0] });
}