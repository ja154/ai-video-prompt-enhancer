
interface EnhancePromptParams {
  userPrompt: string;
  contentTone: string;
  pov: string;
}

export const enhancePrompt = async ({ userPrompt, contentTone, pov }: EnhancePromptParams): Promise<string> => {
  try {
    const response = await fetch('/api/enhance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userPrompt, contentTone, pov }),
    });

    const data = await response.json();

    if (!response.ok) {
        // Use the error message from the serverless function's response
        throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    if (!data.text) {
        throw new Error("The AI returned an empty response. Please try modifying your prompt.");
    }
    
    return data.text;

  } catch (error) {
    console.error('Error calling backend API:', error);
    if (error instanceof Error) {
        // Re-throw with a user-friendly message
        throw new Error(`Failed to enhance prompt: ${error.message}`);
    }
    throw new Error('An unknown error occurred while communicating with the server.');
  }
};
