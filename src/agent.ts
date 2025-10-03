import OpenAI from "openai";
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildDocsSystemPrompt,
} from "./prompt";
import type { DietPlanRequest } from "./types";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  timeout: 2 * 60 * 1000,
  logLevel: "debug",
});


// FUNÇÃO GENERATOR 
// PODDE PARA E RETORNAR DE ONDE PAROU
// PODE SER USADA PARA STREAMING
export async function* generateDietPlan(input: DietPlanRequest) {
  const diretrizes = fs.readFileSync("./knowledge/diretrizes.md", "utf-8");

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "system", content: buildDocsSystemPrompt(diretrizes) },
      { role: "user", content: buildUserPrompt(input) },
    ],
    temperature: 0.6,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if(delta) yield delta;
  }
}
