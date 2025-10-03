import OpenAI from "openai";
import { buildSystemPrompt, buildUserPrompt, buildDocsSystemPrompt } from "./prompt.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 2 * 60 * 1000,
});
export async function* generateDietPlan(input) {
    const knowledgePath = path.join(process.cwd(), "knowledge", "diretrizes.md");
    let diretrizes = "";
    try {
        diretrizes = fs.readFileSync(knowledgePath, "utf-8");
    }
    catch (error) {
        console.warn("Arquivo de diretrizes não encontrado, continuando sem ele");
    }
    const stream = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: buildSystemPrompt() },
            ...(diretrizes ? [{ role: "system", content: buildDocsSystemPrompt(diretrizes) }] : []),
            { role: "user", content: buildUserPrompt(input) },
        ],
        temperature: 0.6,
        stream: true,
    });
    for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta)
            yield delta;
    }
}
