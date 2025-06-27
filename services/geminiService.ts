import { EnhancePromptParams } from '../types';

export async function enhancePrompt(params: EnhancePromptParams): Promise<string> {
  const res = await fetch('/api/enhance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'Server error');
  }

  const data = await res.json();
  return data.result;
}
