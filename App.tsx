import React, { useState, useCallback } from 'react';
import { enhancePrompt } from './services/geminiService';
import { TONE_OPTIONS, POV_OPTIONS } from './constants';
import { ContentTone, PointOfView } from './types';

const App = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [contentTone, setContentTone] = useState<ContentTone>(ContentTone.Neutral);
  const [pov, setPov] = useState<PointOfView>(PointOfView.ThirdPerson);

  const handleGenerateClick = useCallback(async () => {
    if (!userPrompt.trim()) return;

    setGeneratedPrompt('');
    setError('');
    setIsLoading(true);

    try {
      const result = await enhancePrompt({ userPrompt, contentTone, pov });
      setGeneratedPrompt(result);
    } catch (err) {
      console.error('Error generating prompt:', err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [userPrompt, contentTone, pov]);

  const handleCopyToClipboard = useCallback(() => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).catch(err => {
      console.error('Failed to copy text: ', err);
      alert("Failed to copy text to clipboard.");
    });
  }, [generatedPrompt]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-3xl rounded-3xl bg-white/5 backdrop-blur-lg p-8 shadow-2xl border border-gray-700 transition duration-500 hover:shadow-emerald-500/30">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-emerald-400 tracking-tight">
          AI Video Prompt Enhancer
        </h1>
        <p className="text-center text-gray-300 mb-6 max-w-2xl mx-auto">
          Enter a simple idea, choose tone and POV, and let AI transform it into a detailed, cinematic 8-second video prompt.
        </p>

        <label htmlFor="userPrompt" className="block text-lg font-medium text-gray-200 mb-2">
          Your Prompt
        </label>
        <textarea
          id="userPrompt"
          className="w-full p-4 rounded-xl bg-gray-800/70 border border-gray-600 focus:ring-2 focus:ring-emerald-500 transition duration-200 resize-y mb-6 shadow-inner placeholder-gray-400"
          rows={4}
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="e.g., A dog in a park"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="contentTone" className="block text-lg text-gray-200 mb-2">Content Tone</label>
            <select
              id="contentTone"
              className="w-full p-3 rounded-lg bg-gray-800/70 border border-gray-600 focus:ring-2 focus:ring-emerald-500 transition duration-200 shadow-inner"
              value={contentTone}
              onChange={(e) => setContentTone(e.target.value as ContentTone)}
            >
              {TONE_OPTIONS.map(tone => <option key={tone} value={tone}>{tone}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pov" className="block text-lg text-gray-200 mb-2">Point of View (POV)</label>
            <select
              id="pov"
              className="w-full p-3 rounded-lg bg-gray-800/70 border border-gray-600 focus:ring-2 focus:ring-emerald-500 transition duration-200 shadow-inner"
              value={pov}
              onChange={(e) => setPov(e.target.value as PointOfView)}
            >
              {POV_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleGenerateClick}
            disabled={isLoading || !userPrompt.trim()}
            className={`
              px-8 py-3 rounded-full text-lg font-semibold
              bg-gradient-to-r from-emerald-500 to-teal-600
              text-white shadow-lg transform transition-all duration-300 ease-in-out
              ${isLoading || !userPrompt.trim()
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 hover:from-emerald-600 hover:to-teal-700 active:scale-95'}
            `}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Enhance Prompt'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-800/80 p-4 rounded-lg text-red-100 mb-6 animate-pulse shadow-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {generatedPrompt && (
          <div className="mt-8 animate-fade-in">
            <label htmlFor="generatedPrompt" className="block text-lg font-medium text-gray-200 mb-2">
              Enhanced Video Prompt:
            </label>
            <textarea
              id="generatedPrompt"
              className="w-full p-4 rounded-xl bg-gray-800/70 border border-gray-600 focus:ring-2 focus:ring-emerald-500 transition duration-200 resize-y min-h-[150px] shadow-inner"
              rows={7}
              value={generatedPrompt}
              readOnly
              placeholder="Your enhanced prompt will appear here..."
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCopyToClipboard}
                className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow-md hover:bg-blue-700 transform transition duration-200 hover:scale-105 active:scale-95"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
