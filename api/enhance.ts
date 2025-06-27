
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

interface EnhancePromptParams {
  userPrompt: string;
  contentTone: string;
  pov: string;
}

// This is a Vercel Serverless Function
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

  if (!process.env.API_KEY) {
    console.error("API key is not set.");
    return response.status(500).json({ error: 'Server configuration error: API key not found.' });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const promptForAI = `You are a prompt engineering expert for text-to-image and text-to-video AI models like "Veo". Your task is to take a simple user prompt and expand it into a highly detailed, descriptive, and optimized prompt, specifically tailored for an 8-second video clip.

Focus on:
- **Video Duration:** Ensure the description implies a concise, impactful 8-second video sequence.
- **Content Tone:** The overall emotional tone of the video (e.g., ${contentTone}).
- **Point of View (POV):** The camera perspective (e.g., ${pov}).
- **Artistic Style/Medium:** (e.g., cinematic, animated, hyperrealistic).
- **Lighting and Atmosphere:** (e.g., golden hour, eerie, vibrant).
- **Composition and Camera Movement:** (e.g., tracking shot, close-up, panning, zooming).
- **Color Palette:** (e.g., cool tones, vivid, monochrome).
- **Emotion and Mood:** (e.g., joy, suspense, wonder).
- **Environment and Setting Details:** (e.g., bustling city, serene forest).
- **Character/Subject Details:** (appearance, action, expression, interaction).
- **Quality/Resolution:** (e.g., 4K, ultra-detailed, crisp).

Transform the following user prompt into an advanced, detailed prompt (aim for 150-250 words to allow for detail within an 8-second concept) suitable for high-quality 8-second video generation, ensuring smooth, dynamic, and visually rich content:

User Prompt: "${userPrompt}"

Start directly with the enhanced video prompt. Do not include any introductory text like "Here is the enhanced prompt:".`;

  try {
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: promptForAI,
    });
    
    const text = result.text;
    if (!text) {
        return response.status(500).json({ error: "The AI returned an empty response." });
    }

    // Send the successful response back to the client
    return response.status(200).json({ text });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return response.status(500).json({ error: `Failed to get response from AI: ${errorMessage}` });
  }
}
