{generatedPrompt && (
  <div className="mt-8">
    <label htmlFor="generatedPrompt" className="block text-lg font-medium text-gray-200 mb-2">
      Enhanced Video Prompt (8-sec optimized):
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
    <div className="flex justify-end mt-4">
      <button
        onClick={handleCopyToClipboard}
        className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow-md hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105 active:scale-95"
        aria-label="Copy enhanced prompt to clipboard"
      >
        Copy to Clipboard
      </button>
    </div>
  </div>
)}
