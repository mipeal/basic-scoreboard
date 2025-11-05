import { useEffect } from 'react';
import { useScoreboardStore } from '../store/useScoreboardStore';
import { CTFDApiClient } from '../lib/ctfd-api';

export function useDataRefresh() {
  const {
    config,
    isAuthenticated,
    autoRefresh,
    refreshInterval,
    setScoreboard,
    setChallenges,
    setSolves,
    setSubmissions,
    setLoading,
    setError,
    setLastUpdate,
  } = useScoreboardStore();

  useEffect(() => {
    if (!isAuthenticated || !config || !autoRefresh) return;

    // Skip refresh for demo mode
    if (config.apiKey === 'demo_key') return;

    const client = new CTFDApiClient(config);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching CTFD data...', { 
          instanceUrl: config.instanceUrl, 
          apiKeyLength: config.apiKey.length 
        });

        // Fetch scoreboard first (not paginated)
        const scoreboardPromise = client.getScoreboard();
        
        // Fetch challenges with progressive updates
        const challengesPromise = client.getChallenges((pageData, currentTotal, totalPages) => {
          console.log(`Challenges: Loaded page with ${pageData.length} items (${currentTotal} total so far${totalPages ? ` of ~${totalPages} pages` : ''})`);
        });
        
        // Fetch solves with progressive updates
        const solvesPromise = client.getSolves((pageData, currentTotal, totalPages) => {
          console.log(`Solves: Loaded page with ${pageData.length} items (${currentTotal} total so far${totalPages ? ` of ~${totalPages} pages` : ''})`);
        }).catch(err => {
          console.warn('Solves endpoint not available:', err.message);
          return [];
        });
        
        // Fetch submissions with progressive updates
        const submissionsPromise = client.getSubmissions((pageData, currentTotal, totalPages) => {
          console.log(`Submissions: Loaded page with ${pageData.length} items (${currentTotal} total so far${totalPages ? ` of ~${totalPages} pages` : ''})`);
        });

        // Wait for all data to be fetched
        const results = await Promise.allSettled([
          scoreboardPromise,
          challengesPromise,
          solvesPromise,
          submissionsPromise,
        ]);

        const scoreboard = results[0].status === 'fulfilled' ? results[0].value : [];
        const challenges = results[1].status === 'fulfilled' ? results[1].value : [];
        const solves = results[2].status === 'fulfilled' ? results[2].value : [];
        const submissions = results[3].status === 'fulfilled' ? results[3].value : [];

        console.log('Data fetched successfully:', {
          scoreboard: scoreboard.length,
          challenges: challenges.length,
          solves: solves.length + (results[2].status === 'rejected' ? ' (endpoint not available)' : ''),
          submissions: submissions.length
        });

        if (results[2].status === 'rejected') {
          console.warn('Solves endpoint not available on this CTFd instance');
        }

        setScoreboard(scoreboard);
        setChallenges(challenges);
        setSolves(solves);
        setSubmissions(submissions);
        setLastUpdate(Date.now());
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to fetch data';
        setError(errorMessage);
        console.error('Data refresh error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval
    const intervalId = setInterval(fetchData, refreshInterval);

    return () => clearInterval(intervalId);
  }, [
    config,
    isAuthenticated,
    autoRefresh,
    refreshInterval,
    setScoreboard,
    setChallenges,
    setSolves,
    setSubmissions,
    setLoading,
    setError,
    setLastUpdate,
  ]);
}
