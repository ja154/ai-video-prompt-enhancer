import React, { useState, useCallback, useEffect } from 'react';
import { enhancePrompt } from './services/geminiService';
import { TONE_OPTIONS, POV_OPTIONS } from './constants';
import { ContentTone, PointOfView } from './types';

const LOCAL_STORAGE_KEY = 'savedEnhancedPrompt';

const App = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [contentTone, setContentTone] = useState<ContentTone>(ContentTone.Neutral);
  const [pov, setPov] = useState<PointOfView>(PointOfView.ThirdPerson);
  const [showSavedNotice, setShowSavedNotice] = useState(false);

  // Load saved prompt from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setGeneratedPrompt(saved);
    }
  }, []);

  // Handle AI generation
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

  // Copy to clipboard
  const handleCopyToClipboard = useCallback(() => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      alert('Prompt copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert("Failed to copy text to clipboard.");
    });
  }, [generatedPrompt]);

  // Save edits to local storage
  const handleSaveEdits = useCallback(() => {
    if (!generatedPrompt.trim()) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, generatedPrompt);
    setShowSavedNotice(true);
    setTimeout(() => setShowSavedNotice(false), 2000);
  }, [generatedPrompt]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-4xl bg-gray-800 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-emerald-400">
          AI Video Prompt Enhancer
        </h1>
        <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
          Enter a simple prompt, select your desired tone and POV, and our AI will expand it into a detailed, 8-second video prompt optimized for models like Veo.
        </p>

        <div className="mb-6">
          <label htmlFor="userPrompt" className="block text-lg font-medium text-gray-200 mb-2">
            Your Initial Prompt:
          </label>
          <textarea
            id="userPrompt"
            className="w-full p-4 rounded-lg bg-gray-700 text-gray-50 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 ease-in-out resize-y min-h-[100px] shadow-inner"
            rows={4}
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="e.g., A dog in a park"
            aria-label="Your Initial Prompt"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="contentTone" className="block text-lg font-medium text-gray-200 mb-2">
              Content Tone:
            </label>
            <select
              id="contentTone"
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-50 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 ease-in-out shadow-inner appearance-none pr-10"
              value={contentTone}
              onChange={(e) => setContentTone(e.target.value as ContentTone)}
              aria-label="Select Content Tone"
            >
              {TONE_OPTIONS.map(tone => <option key={tone} value={tone}>{tone}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="pov" className="block text-lg font-medium text-gray-200 mb-2">
              Point of View (POV):
            </label>
            <select
              id="pov"
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-50 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 ease-in-out shadow-inner appearance-none pr-10"
              value={pov}
              onChange={(e) => setPov(e.target.value as PointOfView)}
              aria-label="Select Point of View"
            >
              {POV_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleGenerateClick}
            disabled={isLoading || !userPrompt.trim()}
            className={`
              px-8 py-3 rounded-full text-lg font-semibold
              bg-gradient-to-r from-emerald-500 to-teal-600
              text-white shadow-lg transform transition-all duration-300 ease-in-out
              ${isLoading || !userPrompt.trim()
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:scale-105 hover:from-emerald-600 hover:to-teal-700 active:scale-95'
              }
            `}
            aria-live="polite"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Enhance Prompt for Video'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-800 p-4 rounded-lg text-red-100 mb-8 shadow-md" role="alert">
            <p className="font-semibold">An error occurred:</p>
            <p>{error}</p>
          </div>
        )}

        {generatedPrompt && (
          <div className="mt-8 animate-fade-in">
            <label htmlFor="generatedPrompt" className="block text-lg font-medium text-gray-200 mb-2">
              Enhanced Video Prompt (Editable):
            </label>
            <textarea
              id="generatedPrompt"
              className="w-full p-4 rounded-lg bg-gray-700 text-gray-50 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 ease-in-out resize-y min-h-[150px] shadow-inner"
              rows={7}
              value={generatedPrompt}
              onChange={(e) => setGeneratedPrompt(e.target.value)}
              placeholder="Your enhanced prompt will appear here..."
              aria-label="Enhanced Video Prompt"
            ></textarea>
            <div className="flex flex-wrap justify-end mt-4 space-x-3">
              <button
                onClick={handleSaveEdits}
                className="px-5 py-2 rounded-full bg-green-600 text-white text-sm font-medium shadow-md hover:bg-green-700 transition duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                aria-label="Save edited prompt"
              >
                Save Edits
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow-md hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                aria-label="Copy enhanced prompt to clipboard"
              >
                Copy to Clipboard
              </button>
            </div>
            {showSavedNotice && (
              <p className="text-green-400 mt-2 text-sm">Edits saved!</p>
            )}
          </div>
        )}

        <div className="mt-12 border-t border-gray-700 pt-6 text-gray-400 text-sm">
          <h2 className="text-center text-emerald-300 font-semibold mb-2">Prompt Tips</h2>
          <ul className="list-disc list-inside max-w-2xl mx-auto space-y-2">
            <li>Keep your initial prompt concise and clear.</li>
            <li>Use specific nouns and adjectives.</li>
            <li>Choose a tone and POV that match your intended mood.</li>
            <li>Edit the enhanced prompt to fine-tune details before copying.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
