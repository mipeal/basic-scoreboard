import axios, { AxiosInstance } from 'axios';
import type {
  CTFDUser,
  CTFDChallenge,
  CTFDSolve,
  CTFDSubmission,
  ScoreboardEntry,
  CTFDConfig,
} from '../types/ctfd';

export class CTFDApiClient {
  private config: CTFDConfig;
  private instanceUrl: string;

  constructor(config: CTFDConfig) {
    this.config = config;
    this.instanceUrl = config.instanceUrl.replace(/\/$/, '');
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    // Use proxy in development, direct calls in production
    const isDevelopment = import.meta.env.DEV;
    
    // Build the URL based on environment
    const url = isDevelopment 
      ? `/ctfd-api/api/v1${endpoint}` // Development: use Vite dev server proxy
      : `${this.instanceUrl}/api/v1${endpoint}`; // Production: direct API call

    const headers: HeadersInit = {
      'Authorization': `Token ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
    };

    // Add X-CTFd-URL header only for development proxy
    if (isDevelopment) {
      headers['X-CTFd-URL'] = this.instanceUrl;
    }

    console.log(`Making fetch request to: ${url} (${isDevelopment ? 'dev proxy' : 'direct'})`);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'omit',
        mode: isDevelopment ? 'same-origin' : 'cors',
      });
      
      console.log(`Fetch response status: ${response.status}`);
      console.log(`Fetch response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your CTFD API token.');
        } else if (response.status === 403) {
          throw new Error('Access forbidden. Check your API permissions.');
        } else if (response.status === 404) {
          throw new Error(`API endpoint not found: ${endpoint}`);
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('Received non-JSON response:', text.substring(0, 200));
        throw new Error(`Expected JSON response, got ${contentType}. Check your API permissions.`);
      }
      
      const data = await response.json();
      console.log('Fetch request successful, data received:', {
        endpoint,
        dataType: typeof data,
        isArray: Array.isArray(data),
        hasDataProperty: data && 'data' in data,
        keys: data ? Object.keys(data).slice(0, 5) : [],
        sampleData: data
      });
      // Return full response to preserve meta information for pagination
      return data as T;
    } catch (error: any) {
      console.error(`Fetch request failed:`, error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. This could be due to CORS restrictions or network connectivity issues.');
      }
      
      throw error;
    }
  }

  private async getPaginatedData<T>(
    endpoint: string, 
    onPageFetched?: (pageData: T[], currentTotal: number, totalPages?: number) => void
  ): Promise<T[]> {
    const allData: T[] = [];
    let page = 1;
    let hasMore = true;
    let totalPages: number | undefined;
    
    while (hasMore) {
      const response = await this.makeRequest<any>(`${endpoint}?page=${page}`);
      console.log(`Fetched page ${page} from ${endpoint}`, response);
      
      // Handle both array response and paginated response
      if (Array.isArray(response)) {
        allData.push(...response);
        if (onPageFetched) {
          onPageFetched(response, allData.length, 1);
        }
        hasMore = false; // No pagination, just return all
      } else if (response.data && Array.isArray(response.data)) {
        allData.push(...response.data);
        
        // Check if there are more pages
        const meta = response.meta;
        if (meta && meta.pagination) {
          totalPages = meta.pagination.pages;
          hasMore = page < meta.pagination.pages;
          
          // Call callback with current page data
          if (onPageFetched) {
            onPageFetched(response.data, allData.length, totalPages);
          }
          
          page++;
        } else {
          if (onPageFetched) {
            onPageFetched(response.data, allData.length, 1);
          }
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
      
      // Safety limit to prevent infinite loops
      if (page > 100) {
        console.warn(`Reached maximum page limit for ${endpoint}`);
        break;
      }
    }
    
    console.log(`Fetched ${allData.length} items from ${endpoint} across ${page} page(s)`);
    return allData;
  }

  async getUsers(onPageFetched?: (pageData: CTFDUser[], currentTotal: number, totalPages?: number) => void): Promise<CTFDUser[]> {
    try {
      return await this.getPaginatedData<CTFDUser>('/users', onPageFetched);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getChallenges(onPageFetched?: (pageData: CTFDChallenge[], currentTotal: number, totalPages?: number) => void): Promise<CTFDChallenge[]> {
    try {
      return await this.getPaginatedData<CTFDChallenge>('/challenges', onPageFetched);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      throw error;
    }
  }

  async getSolves(onPageFetched?: (pageData: CTFDSolve[], currentTotal: number, totalPages?: number) => void): Promise<CTFDSolve[]> {
    try {
      return await this.getPaginatedData<CTFDSolve>('/solves', onPageFetched);
    } catch (error) {
      console.error('Error fetching solves:', error);
      throw error;
    }
  }

  async getSubmissions(onPageFetched?: (pageData: CTFDSubmission[], currentTotal: number, totalPages?: number) => void): Promise<CTFDSubmission[]> {
    try {
      return await this.getPaginatedData<CTFDSubmission>('/submissions', onPageFetched);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  }

  async getScoreboard(): Promise<ScoreboardEntry[]> {
    try {
      const response = await this.makeRequest<any>('/scoreboard');
      // Scoreboard might return array directly or { data: [...] }
      return Array.isArray(response) ? response : (response.data || response);
    } catch (error) {
      console.error('Error fetching scoreboard:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    console.log('Testing connection to:', this.instanceUrl);
    
    try {
      // Test scoreboard endpoint first (most reliable)
      const scoreboardData = await this.getScoreboard();
      console.log('Connection test successful:', Array.isArray(scoreboardData) ? scoreboardData.length : 'data received', 'entries');
      return true;
    } catch (error: any) {
      console.error('Connection test failed:', error.message);
      throw error;
    }
  }
}
