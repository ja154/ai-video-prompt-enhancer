import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface EnhancePromptParams {
  userPrompt: string;
  contentTone: string;
  pov: string;
  selectedModel: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: EnhancePromptParams = await req.json();
    const { userPrompt, contentTone, pov, selectedModel } = body;

    // Validate
    if (!userPrompt || !contentTone || !pov || !selectedModel) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    let finalResult = '';

    // Handle Google Gemini
    if (selectedModel === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('Gemini API key is missing.');
        return NextResponse.json({ error: 'Gemini API key not set on server.' }, { status: 500 });
      }

      const genAI = new GoogleGenAI({ apiKey });
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are a prompt engineering expert for text-to-video AI (like Veo).
Your task is to transform the user's simple prompt into a highly detailed, descriptive, 8-second video prompt.

- Content Tone: ${contentTone}
- Point of View: ${pov}
- User Prompt: ${userPrompt}

Write only the enhanced video prompt. No preamble or explanation.
`;

      const result = await model.generateContent(prompt);
      finalResult = result?.response?.text() || '';

    // Handle OpenAI GPT
    } else if (selectedModel === 'openai-gpt') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error('OpenAI API key is missing.');
        return NextResponse.json({ error: 'OpenAI API key not set on server.' }, { status: 500 });
      }

      const systemMessage = `
You are a prompt engineering expert for text-to-video AI (like Veo).
Your task: turn the user's simple prompt into a detailed, cinematic, optimized 8-second video prompt.

- Content Tone: ${contentTone}
- Point of View: ${pov}
- Video Duration: 8 seconds

Return ONLY the enhanced video prompt. No preamble or explanation.
`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      });

      finalResult = completion.choices?.[0]?.message?.content?.trim() || '';

    } else {
      return NextResponse.json({ error: 'Invalid model selection.' }, { status: 400 });
    }

    // Return result
    return NextResponse.json({ result: finalResult });

  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown server error.' },
      { status: 500 }
    );
  }
}
