import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

interface EnhancePromptParams {
  userPrompt: string;
  contentTone: string;
  pov: string;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userPrompt, contentTone, pov } = request.body as EnhancePromptParams;

  if (!userPrompt || !contentTone || !pov) {
    return response.status(400).json({ error: 'Missing required parameters: userPrompt, contentTone, pov' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API key is not set.");
    return response.status(500).json({ error: 'Server configuration error: API key not found.' });
  }

  const ai = new GoogleGenAI({ apiKey });

  const promptForAI = `You are a prompt engineering expert for text-to-image and text-to-video AI models like "Veo". Your task is to take a simple user prompt and expand it into a highly detailed, descriptive, and optimized prompt, specifically tailored for an 8-second video clip.

Focus on:
- Video Duration: Ensure the description implies a concise, impactful 8-second video sequence.
- Content Tone: ${contentTone}
- Point of View: ${pov}

Transform the following user prompt into an advanced, detailed prompt (aim for 150-250 words to allow for detail within an 8-second concept):

User Prompt: "${userPrompt}"

Start directly with the enhanced video prompt. Do not include any introductory text.`;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: promptForAI,
    });

    const text = result.text;
    if (!text) {
      return response.status(500).json({ error: "The AI returned an empty response." });
    }

    return response.status(200).json({ text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return response.status(500).json({ error: `Failed to get response from AI: ${message}` });
  }
}
