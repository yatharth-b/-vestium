import type { NextApiRequest, NextApiResponse } from "next";

import OpenAI from "openai";

const openai = new OpenAI();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let messages_ = [];

  let data = await req.body;
  console.log(data)

  messages_ = data.messages;

  const ai_response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages_,
  });

  console.log(ai_response);

  return res.json({ message: ai_response.choices[0] });
}
