export enum ContentTone {
  Neutral = 'Neutral',
  Dramatic = 'Dramatic',
  Cinematic = 'Cinematic',
  Lighthearted = 'Lighthearted'
}

export enum PointOfView {
  FirstPerson = 'FirstPerson',
  SecondPerson = 'SecondPerson',
  ThirdPerson = 'ThirdPerson'
}

export const TONE_OPTIONS = [
  ContentTone.Neutral,
  ContentTone.Dramatic,
  ContentTone.Cinematic,
  ContentTone.Lighthearted
];

export const POV_OPTIONS = [
  PointOfView.FirstPerson,
  PointOfView.SecondPerson,
  PointOfView.ThirdPerson
];

// ✅ Model options for dropdown
export const MODEL_OPTIONS = [
  { id: 'gemini', name: 'Google Gemini' },
  { id: 'openai-gpt', name: 'OpenAI GPT' }
];
