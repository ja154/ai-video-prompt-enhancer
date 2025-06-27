export enum ContentTone {
  Neutral = 'Neutral',
  Cinematic = 'Cinematic',
  Dramatic = 'Dramatic',
  Playful = 'Playful',
  Serious = 'Serious',
  Epic = 'Epic'
}

export enum PointOfView {
  FirstPerson = 'FirstPerson',
  ThirdPerson = 'ThirdPerson',
  Omniscient = 'Omniscient'
}

export type ModelOption = 'gemini' | 'openai-gpt';

export interface EnhancePromptParams {
  userPrompt: string;
  contentTone: ContentTone;
  pov: PointOfView;
  selectedModel: ModelOption;
}
