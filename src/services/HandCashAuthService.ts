// HandCash Authentication Service for Bitcoin-Art - Next.js Implementation
// Adapted from Bitcoin-Writer with environment variable updates

export interface HandCashConfig {
  appId: string;
  appSecret?: string;
  redirectUrl: string;
  environment: 'production' | 'development';
}

export interface HandCashUser {
  handle: string;
  paymail: string;
  publicKey?: string;
  avatarUrl?: string;
  displayName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

export class HandCashAuthService {
  private config: HandCashConfig;
  public currentUser: HandCashUser | null = null;
  public tokens: AuthTokens | null = null;
  
  // HandCash API endpoints
  private readonly HANDCASH_AUTH_URL = 'https://app.handcash.io/auth/authorize';
  private readonly HANDCASH_API_BASE = 'https://api.handcash.io';
  private readonly HANDCASH_CONNECT_BASE = 'https://connect.handcash.io/v3';

  constructor() {
    // Initialize configuration from environment variables (Next.js style)
    this.config = {
      appId: process.env.NEXT_PUBLIC_HANDCASH_APP_ID || '',
      appSecret: process.env.HANDCASH_APP_SECRET,
      redirectUrl: process.env.NEXT_PUBLIC_HANDCASH_REDIRECT_URL || 
                   (process.env.NODE_ENV === 'production' ? 
                    (typeof window !== 'undefined' ? window.location.origin + '/' : '') : 
                    'http://localhost:3000/'),
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
    };

    // Debug log to verify environment variables are loaded (only once)
    if (typeof window !== 'undefined' && !(window as any).handcashConfigLogged) {
      console.log('=== HandCash Configuration (Bitcoin-Art) ===');
      console.log('App ID configured:', this.config.appId ? 'Yes' : 'No');
      console.log('App ID length:', this.config.appId?.length || 0);
      console.log('Redirect URL:', this.config.redirectUrl);
      console.log('Environment:', this.config.environment);
      console.log('==========================================');
      (window as any).handcashConfigLogged = true;
    }

    // Load existing session if available (only in browser)
    if (typeof window !== 'undefined') {
      this.loadSession();
    }
  }

  // Load session from localStorage
  private loadSession(): void {
    try {
      const savedTokens = localStorage.getItem('handcash_tokens');
      const savedUser = localStorage.getItem('handcash_user');
      
      if (savedTokens && savedUser) {
        const tokens = JSON.parse(savedTokens);
        const user = JSON.parse(savedUser);
        
        // Clear old sessions with generic "handcash_user" handle
        if (user.handle === 'handcash_user') {
          console.log('Clearing old session with generic username');
          this.clearSession();
          return;
        }
        
        // Validate session is not expired
        if (this.isSessionValid(tokens)) {
          this.tokens = tokens;
          this.currentUser = user;
        } else {
          // Clear expired session
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      this.clearSession();
    }
  }

  // Check if session is still valid
  private isSessionValid(tokens: AuthTokens): boolean {
    if (!tokens.accessToken) return false;
    
    // If we have expiry info, check it
    if (tokens.expiresIn) {
      const savedAt = localStorage.getItem('handcash_tokens_saved_at');
      if (savedAt) {
        const expiryTime = parseInt(savedAt) + (tokens.expiresIn * 1000);
        return Date.now() < expiryTime;
      }
    }
    
    // Default to valid if we can't determine
    return true;
  }

  // Save session to localStorage
  public saveSession(): void {
    if (typeof window === 'undefined') return;
    
    if (this.tokens) {
      localStorage.setItem('handcash_tokens', JSON.stringify(this.tokens));
      localStorage.setItem('handcash_tokens_saved_at', Date.now().toString());
    }
    if (this.currentUser) {
      localStorage.setItem('handcash_user', JSON.stringify(this.currentUser));
    }
  }

  // Clear session
  private clearSession(): void {
    if (typeof window === 'undefined') return;
    
    this.tokens = null;
    this.currentUser = null;
    localStorage.removeItem('handcash_tokens');
    localStorage.removeItem('handcash_tokens_saved_at');
    localStorage.removeItem('handcash_user');
    // Also clear old format data
    localStorage.removeItem('handcash_auth_token');
    // Clear sessionStorage too
    sessionStorage.clear();
  }

  // Generate HandCash authorization URL
  public getAuthorizationUrl(): string {
    if (!this.config.appId) {
      throw new Error('HandCash App ID is not configured');
    }

    const authUrl = `https://app.handcash.io/#/authorizeApp?appId=${this.config.appId}`;
    
    console.log('=== Generated Auth URL (Bitcoin-Art) ===');
    console.log('URL:', authUrl);
    console.log('Make sure redirect URL is set in HandCash dashboard to:', this.config.redirectUrl);
    console.log('======================================');
    
    // Store state for CSRF protection
    this.generateState();
    
    return authUrl;
  }

  // Generate random state for CSRF protection
  private generateState(): string {
    if (typeof window === 'undefined') return '';
    
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('handcash_oauth_state', state);
    return state;
  }

  // Start OAuth login flow
  public async login(): Promise<void> {
    try {
      if (!this.config.appId) {
        console.error('HandCash App ID is not configured!');
        alert('HandCash App ID is not configured. Please check your environment variables.');
        return;
      }
      
      // Clear any existing session first to ensure fresh login
      this.clearSession();
      
      const authUrl = this.getAuthorizationUrl();
      console.log('=== HandCash OAuth2 Authentication (Bitcoin-Art) ===');
      console.log('App ID:', this.config.appId);
      console.log('Redirect URL (configured in HandCash dashboard):', this.config.redirectUrl);
      console.log('Authorization URL:', authUrl);
      console.log('=================================================');
      console.log('IMPORTANT: Make sure', this.config.redirectUrl, 'is configured in your HandCash app settings!');
      
      if (typeof window !== 'undefined') {
        // Add a small delay and confirm before redirecting
        console.log('Redirecting to HandCash in 1 second...');
        setTimeout(() => {
          console.log('Redirecting now to:', authUrl);
          window.location.href = authUrl;
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to start OAuth flow:', error);
      throw error;
    }
  }

  // Handle HandCash callback
  public async handleCallback(callbackUrl: string): Promise<HandCashUser> {
    try {
      console.log('=== HandCash Callback Handler (Bitcoin-Art) ===');
      console.log('Full callback URL:', callbackUrl);
      
      const url = new URL(callbackUrl);
      
      // Extract authToken from various possible locations
      let authToken: string | null = null;
      
      // Check hash fragment first
      if (url.hash) {
        const hashContent = url.hash.substring(1);
        console.log('Hash content:', hashContent);
        
        if (hashContent.includes('=')) {
          const hashParams = new URLSearchParams(hashContent);
          authToken = hashParams.get('authToken') || hashParams.get('token');
        } else if (hashContent.length > 20) {
          authToken = hashContent;
        }
      }
      
      // Check query params as fallback
      if (!authToken) {
        const urlParams = new URLSearchParams(url.search);
        authToken = urlParams.get('authToken') || 
                   urlParams.get('auth_token') ||
                   urlParams.get('token');
      }
      
      // Check for errors
      const urlParams = new URLSearchParams(url.search);
      const hashParams = url.hash ? new URLSearchParams(url.hash.substring(1)) : new URLSearchParams();
      const error = urlParams.get('error') || hashParams.get('error');
      
      console.log('Extracted authToken:', authToken);
      console.log('Found error:', error);
      
      if (error) {
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
        throw new Error(`HandCash error: ${error} - ${errorDescription || 'Unknown error'}`);
      }
      
      if (!authToken) {
        console.error('No authToken found in callback URL');
        console.log('URL hash:', url.hash);
        console.log('URL search:', url.search);
        throw new Error('No authToken received from HandCash. Check the console for debug information.');
      }
      
      // Store the token
      this.tokens = {
        accessToken: authToken,
        tokenType: 'Bearer'
      };
      
      // Fetch user profile
      const user = await this.fetchUserProfile();
      this.currentUser = user;
      
      // Save session
      this.saveSession();
      
      return user;
    } catch (error) {
      console.error('Callback handling failed:', error);
      throw error;
    }
  }

  // Fetch user profile from HandCash
  public async fetchUserProfile(): Promise<HandCashUser> {
    if (!this.tokens?.accessToken) {
      throw new Error('No access token available');
    }

    // Try to fetch profile from server-side API first
    try {
      const apiBase = this.config.environment === 'production' 
        ? ''  // In production, use same origin (Vercel handles /api routes)
        : 'http://localhost:3000';  // Local Next.js server
      
      console.log('Fetching user profile from Next.js API...');
      console.log('API Base:', apiBase);
      console.log('Auth Token (first 20 chars):', this.tokens.accessToken.substring(0, 20) + '...');
      
      // Call our Next.js API endpoint
      const response = await fetch(`${apiBase}/api/handcash-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authToken: this.tokens.accessToken
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile fetched successfully from Next.js API:', data.profile);
        
        if (data.success && data.profile && data.profile.handle && data.profile.handle !== 'unknown') {
          console.log('Using API profile data with handle:', data.profile.handle);
          return {
            handle: data.profile.handle,
            paymail: data.profile.paymail || `${data.profile.handle}@handcash.io`,
            publicKey: data.profile.publicKey,
            avatarUrl: data.profile.avatarUrl,
            displayName: data.profile.displayName || data.profile.handle
          };
        } else {
          console.log('API returned invalid profile data, falling back...');
        }
      } else {
        const error = await response.json();
        console.error('API error fetching profile:', error);
        console.log('API call failed, falling back to other methods...');
      }
    } catch (error) {
      console.error('Failed to fetch user profile from API:', error);
      console.log('API call failed, falling back to other methods...');
    }

    // Fallback: Try to decode the authToken if it's a JWT
    try {
      const tokenParts = this.tokens.accessToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Decoded token payload:', payload);
        
        if (payload.handle || payload.user || payload.username) {
          return {
            handle: payload.handle || payload.user || payload.username,
            paymail: payload.paymail || `${payload.handle || payload.user || 'user'}@handcash.io`,
            publicKey: payload.publicKey || payload.id,
            avatarUrl: payload.avatarUrl || payload.avatar,
            displayName: payload.displayName || payload.name
          };
        }
      }
    } catch (decodeError) {
      console.log('Token is not a JWT or could not be decoded');
    }
    
    // Final fallback - create a unique identifier from the token
    console.warn('Using fallback user data - Enable API endpoint for real profile');
    
    const tokenHash = this.tokens.accessToken.substring(0, 8).toLowerCase();
    const fallbackHandle = `artist_${tokenHash}`;
    
    return {
      handle: fallbackHandle,
      paymail: `${fallbackHandle}@handcash.io`,
      publicKey: this.tokens.accessToken.substring(0, 20),
      avatarUrl: undefined,
      displayName: `Artist ${tokenHash.toUpperCase()}`
    };
  }

  // Make authenticated API request
  public async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.tokens?.accessToken) {
      throw new Error('Not authenticated');
    }

    // Determine the full URL based on the endpoint
    let url: string;
    if (endpoint.startsWith('http')) {
      url = endpoint;
    } else if (endpoint.startsWith('/v1/connect/')) {
      url = `${this.HANDCASH_CONNECT_BASE}${endpoint}`;
    } else if (endpoint.startsWith('/v3/')) {
      url = `${this.HANDCASH_CONNECT_BASE}${endpoint.substring(3)}`;
    } else {
      url = `${this.HANDCASH_CONNECT_BASE}${endpoint}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `${this.tokens.tokenType || 'Bearer'} ${this.tokens.accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Authentication expired, please login again');
      }
      
      let errorMessage = `API request failed: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Request magic link authentication via email
  async requestMagicLink(email: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.config.appId) {
        throw new Error('HandCash App ID is not configured');
      }

      const magicLinkUrl = `${this.HANDCASH_CONNECT_BASE}/users/magiclink`;
      
      const response = await fetch(magicLinkUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-handcash-app-id': this.config.appId,
          ...(this.config.appSecret && { 'x-handcash-app-secret': this.config.appSecret })
        },
        body: JSON.stringify({
          email: email,
          redirectUrl: this.config.redirectUrl
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send magic link');
      }

      return {
        success: true,
        message: result.message || 'Magic link sent to your email'
      };
    } catch (error: any) {
      console.error('Magic link request failed:', error);
      return {
        success: false,
        message: error.message || 'Failed to send magic link'
      };
    }
  }

  // Handle magic link callback
  async handleMagicLinkCallback(token: string): Promise<HandCashUser> {
    console.log('Handling magic link callback with token:', token.substring(0, 20) + '...');
    
    this.tokens = {
      accessToken: token,
      tokenType: 'Bearer'
    };
    
    const user = await this.fetchUserProfile();
    this.currentUser = user;
    
    this.saveSession();
    
    return user;
  }

  // Public methods
  public logout(): void {
    this.clearSession();
  }

  public isAuthenticated(): boolean {
    return this.tokens !== null && this.currentUser !== null;
  }

  public getCurrentUser(): HandCashUser | null {
    return this.currentUser;
  }

  public getAccessToken(): string | null {
    return this.tokens?.accessToken || null;
  }
}