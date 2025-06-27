import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

interface EnhancePromptParams {
  userPrompt: string;
  contentTone: string;
  pov: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userPrompt, contentTone, pov }: EnhancePromptParams = await req.json();

    if (!userPrompt || !contentTone || !pov) {
      return NextResponse.json({ error: 'Missing required parameters: userPrompt, contentTone, pov' }, { status: 400 });
    }

    if (!process.env.API_KEY) {
      console.error("API key is not set.");
      return NextResponse.json({ error: 'Server configuration error: API key not found.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const promptForAI = `You are a prompt engineering expert for text-to-image and text-to-video AI models like "Veo". Your task is to take a simple user prompt and expand it into a highly detailed, descriptive, and optimized prompt, specifically tailored for an 8-second video clip.

Focus on:
- **Video Duration:** Ensure the description implies a concise, impactful 8-second video sequence.
- **Content Tone:**
