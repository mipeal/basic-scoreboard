import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScoreboardStore } from '../store/useScoreboardStore';
import { CTFDApiClient } from '../lib/ctfd-api';
import { Shield, Loader2, AlertCircle, Play, Monitor } from 'lucide-react';
import { demoScoreboard, demoChallenges, demoSolves, demoSubmissions } from '../lib/demo-data';

export function LoginForm() {
  const [instanceUrl, setInstanceUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { setConfig, loadDemoData } = useScoreboardStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!instanceUrl || !apiKey) {
        throw new Error('Please provide both instance URL and API key');
      }

      setDebugInfo(`Saving credentials...\nURL: ${instanceUrl}\nAPI Key: ${apiKey.substring(0, 10)}...\n\nSkipping connection test - trusting your credentials.\nData will be loaded after login.`);

      // Save config without testing - trust the user
      setConfig({ instanceUrl, apiKey });
      setDebugInfo(prev => prev + '\n\n🎉 Credentials saved! Loading dashboard...');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    setDebugInfo('Loading demo data with sample CTFD competition...');
    loadDemoData();
    // Load demo data directly into store
    setTimeout(() => {
      const { setScoreboard, setChallenges, setSolves, setSubmissions } = useScoreboardStore.getState();
      setScoreboard(demoScoreboard);
      setChallenges(demoChallenges);
      setSolves(demoSolves);
      setSubmissions(demoSubmissions);
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="flex items-center justify-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <Shield className="w-16 h-16 text-blue-500" />
            </motion.div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-2">
            CTFD Scoreboard
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Connect to your CTFD instance to start monitoring
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="instanceUrl" className="block text-sm font-medium text-gray-300 mb-2">
                Instance URL
              </label>
              <input
                id="instanceUrl"
                type="url"
                value={instanceUrl}
                onChange={(e) => {
                  setInstanceUrl(e.target.value);
                  setDebugInfo('');
                  setError('');
                }}
                placeholder="https://s2gctf.ncr.ntnu.no/play"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your CTFD instance URL (e.g., https://demo.ctfd.io)
              </p>
              {instanceUrl && (
                <p className="text-xs text-blue-400 mt-1">
                  🔒 {import.meta.env.DEV ? 'Using dev proxy' : 'Direct connection'} to CTFd instance
                </p>
              )}
            </div>

            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                API Key
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setDebugInfo('');
                  setError('');
                }}
                placeholder="ctfd_xxxxxxxxxxxx"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your CTFD API token (found in your CTFD profile settings)
              </p>
            </div>

            {debugInfo && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Debug Information:</h4>
                <pre className="text-xs text-gray-400 whitespace-pre-wrap break-words">
                  {debugInfo}
                </pre>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoMode}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Monitor className="w-5 h-5" />
              Try Demo Mode
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <h4 className="text-sm font-medium text-blue-400 mb-2">Connection Info:</h4>
            <p className="text-xs text-gray-400 mb-2">
              • <strong>Development:</strong> Uses local proxy to bypass CORS<br/>
              • <strong>Production:</strong> Direct connection to your CTFd instance<br/>
              • No connection test - credentials are trusted on save
            </p>
            <ul className="text-xs text-gray-400 space-y-1 ml-2">
              <li>• Make sure your CTFd instance has CORS enabled for production</li>
              <li>• API key must have read permissions for all endpoints</li>
              <li>• Errors will show after data loading attempts</li>
            </ul>
          </div>

          <p className="mt-4 text-xs text-gray-500 text-center">
            <strong>Disclaimer:</strong> We do not keep or hold any data. Your credentials are stored securely in your browser and never sent to any third party.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
