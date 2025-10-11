interface OAuthProvider {
  id: string;
  name: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
  authUrl: string;
  tokenUrl: string;
  userInfoUrl?: string;
  color: string;
  icon: string;
}

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  username?: string;
  provider: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  stats?: {
    followers: number;
    following: number;
    works: number;
  };
  portfolioUrl?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  connectedAccounts: Record<string, UserProfile>;
  primaryProvider: string | null;
}

export class MultiAuthService {
  private providers: Record<string, OAuthProvider> = {
    google: {
      id: 'google',
      name: 'Google',
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      redirectUri: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback/google`,
      scopes: ['openid', 'profile', 'email'],
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      color: '#4285f4',
      icon: 'Google'
    },
    deviantart: {
      id: 'deviantart',
      name: 'DeviantArt',
      clientId: process.env.NEXT_PUBLIC_DEVIANTART_CLIENT_ID || '',
      redirectUri: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback/deviantart`,
      scopes: ['basic', 'browse'],
      authUrl: 'https://www.deviantart.com/oauth2/authorize',
      tokenUrl: 'https://www.deviantart.com/oauth2/token',
      userInfoUrl: 'https://www.deviantart.com/api/v1/oauth2/user/whoami',
      color: '#05cc47',
      icon: 'DeviantArt'
    },
    handcash: {
      id: 'handcash',
      name: 'HandCash',
      clientId: process.env.NEXT_PUBLIC_HANDCASH_APP_ID || '',
      redirectUri: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback/handcash`,
      scopes: ['profile', 'pay'],
      authUrl: 'https://app.handcash.io/authorizeApp',
      tokenUrl: 'https://api.handcash.io/v1/oauth/token',
      userInfoUrl: 'https://api.handcash.io/v1/profile',
      color: '#00d4aa',
      icon: 'HandCash'
    }
  };

  private state: AuthState = {
    isAuthenticated: false,
    user: null,
    connectedAccounts: {},
    primaryProvider: null
  };

  private listeners: ((state: AuthState) => void)[] = [];

  constructor() {
    this.loadState();
    this.setupMessageListener();
  }

  // State management
  private saveState() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('multiauth_state', JSON.stringify(this.state));
    }
  }

  private loadState() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('multiauth_state');
      if (saved) {
        try {
          this.state = { ...this.state, ...JSON.parse(saved) };
        } catch (error) {
          console.error('Failed to load auth state:', error);
        }
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  public subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getState(): AuthState {
    return { ...this.state };
  }

  // OAuth flow helpers
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private generateCodeVerifier(): string {
    const array = new Uint32Array(56/2);
    crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // Provider-specific authentication
  public async authenticate(providerId: string): Promise<void> {
    const provider = this.providers[providerId];
    if (!provider) {
      throw new Error(`Provider ${providerId} not configured`);
    }

    const state = this.generateState();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Store PKCE parameters
    sessionStorage.setItem(`${providerId}_code_verifier`, codeVerifier);
    sessionStorage.setItem(`${providerId}_state`, state);

    // Build auth URL
    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: provider.redirectUri,
      scope: provider.scopes.join(' '),
      response_type: 'code',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    const authUrl = `${provider.authUrl}?${params.toString()}`;

    // Open popup or redirect
    if (typeof window !== 'undefined') {
      const popup = window.open(
        authUrl,
        `${providerId}_auth`,
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (popup) {
        // Wait for popup to close or receive message
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
          }
        }, 1000);
      } else {
        // Fallback to redirect
        window.location.href = authUrl;
      }
    }
  }

  // Handle OAuth callback
  public async handleCallback(providerId: string, code: string, state: string): Promise<UserProfile> {
    const provider = this.providers[providerId];
    if (!provider) {
      throw new Error(`Provider ${providerId} not configured`);
    }

    // Verify state
    const storedState = sessionStorage.getItem(`${providerId}_state`);
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    // Get code verifier
    const codeVerifier = sessionStorage.getItem(`${providerId}_code_verifier`);
    if (!codeVerifier) {
      throw new Error('Missing code verifier');
    }

    // Exchange code for token
    const tokenResponse = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: provider.clientId,
        code: code,
        redirect_uri: provider.redirectUri,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Token exchange failed');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user info
    let userProfile: UserProfile;
    
    if (provider.userInfoUrl) {
      const userResponse = await fetch(provider.userInfoUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userData = await userResponse.json();
      userProfile = this.normalizeUserData(providerId, userData, accessToken);
    } else {
      // Handle providers without user info endpoint
      userProfile = this.createBasicProfile(providerId, accessToken);
    }

    // Update state
    this.state.connectedAccounts[providerId] = userProfile;
    
    if (!this.state.primaryProvider) {
      this.state.primaryProvider = providerId;
      this.state.user = userProfile;
      this.state.isAuthenticated = true;
    }

    this.saveState();
    this.notifyListeners();

    // Clean up session storage
    sessionStorage.removeItem(`${providerId}_code_verifier`);
    sessionStorage.removeItem(`${providerId}_state`);

    return userProfile;
  }

  // Normalize user data from different providers
  private normalizeUserData(providerId: string, userData: any, accessToken: string): UserProfile {
    switch (providerId) {
      case 'google':
        return {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.picture,
          provider: 'google',
          username: userData.email?.split('@')[0]
        };

      case 'deviantart':
        return {
          id: userData.userid,
          name: userData.username,
          avatar: userData.usericon,
          provider: 'deviantart',
          username: userData.username,
          bio: userData.tagline,
          stats: {
            followers: userData.watchers || 0,
            following: userData.watching || 0,
            works: userData.deviations || 0
          },
          portfolioUrl: `https://www.deviantart.com/${userData.username}`
        };

      case 'handcash':
        return {
          id: userData.id || userData.handle,
          name: userData.displayName || userData.handle,
          avatar: userData.avatarUrl,
          provider: 'handcash',
          username: userData.handle,
          location: userData.location
        };

      default:
        return this.createBasicProfile(providerId, accessToken);
    }
  }

  private createBasicProfile(providerId: string, accessToken: string): UserProfile {
    return {
      id: `${providerId}_${Date.now()}`,
      name: `${this.providers[providerId].name} User`,
      provider: providerId,
      username: `user_${Date.now()}`
    };
  }

  // Provider-specific methods
  public async fetchDeviantArtPortfolio(accessToken: string, username: string) {
    try {
      const response = await fetch(
        `https://www.deviantart.com/api/v1/oauth2/browse/user?username=${username}&limit=24`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.results || [];
      }
    } catch (error) {
      console.error('Failed to fetch DeviantArt portfolio:', error);
    }
    return [];
  }

  public async syncPortfolioData(providerId: string) {
    const account = this.state.connectedAccounts[providerId];
    if (!account) return;

    switch (providerId) {
      case 'deviantart':
        // Fetch and sync DeviantArt portfolio
        const deviantArtToken = sessionStorage.getItem('deviantart_token');
        if (deviantArtToken && account.username) {
          const portfolio = await this.fetchDeviantArtPortfolio(deviantArtToken, account.username);
          // Process and store portfolio data
          console.log('DeviantArt portfolio:', portfolio);
        }
        break;

      case 'behance':
        // Note: Behance OAuth is discontinued, but we can still fetch public data
        if (account.username) {
          try {
            const response = await fetch(`https://api.behance.net/v2/users/${account.username}/projects`);
            if (response.ok) {
              const data = await response.json();
              console.log('Behance portfolio:', data);
            }
          } catch (error) {
            console.error('Failed to fetch Behance portfolio:', error);
          }
        }
        break;
    }
  }

  // Account management
  public async disconnectProvider(providerId: string) {
    if (this.state.connectedAccounts[providerId]) {
      delete this.state.connectedAccounts[providerId];

      // If this was the primary provider, switch to another or log out
      if (this.state.primaryProvider === providerId) {
        const remainingProviders = Object.keys(this.state.connectedAccounts);
        if (remainingProviders.length > 0) {
          this.state.primaryProvider = remainingProviders[0];
          this.state.user = this.state.connectedAccounts[remainingProviders[0]];
        } else {
          this.state.primaryProvider = null;
          this.state.user = null;
          this.state.isAuthenticated = false;
        }
      }

      this.saveState();
      this.notifyListeners();
    }
  }

  public async switchPrimaryProvider(providerId: string) {
    if (this.state.connectedAccounts[providerId]) {
      this.state.primaryProvider = providerId;
      this.state.user = this.state.connectedAccounts[providerId];
      this.saveState();
      this.notifyListeners();
    }
  }

  public logout() {
    this.state = {
      isAuthenticated: false,
      user: null,
      connectedAccounts: {},
      primaryProvider: null
    };
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('multiauth_state');
      // Clear all session storage
      Object.keys(this.providers).forEach(providerId => {
        sessionStorage.removeItem(`${providerId}_token`);
        sessionStorage.removeItem(`${providerId}_code_verifier`);
        sessionStorage.removeItem(`${providerId}_state`);
      });
    }

    this.notifyListeners();
  }

  // Message listener for popup callbacks
  private setupMessageListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) return;

        const { type, providerId, code, state, error } = event.data;

        if (type === 'oauth_callback') {
          if (error) {
            console.error('OAuth error:', error);
            return;
          }

          if (code && state) {
            this.handleCallback(providerId, code, state).catch(error => {
              console.error('Callback handling failed:', error);
            });
          }
        }
      });
    }
  }

  // Get available providers
  public getProviders(): OAuthProvider[] {
    return Object.values(this.providers);
  }

  public getProvider(id: string): OAuthProvider | undefined {
    return this.providers[id];
  }

  // Check if provider is connected
  public isProviderConnected(providerId: string): boolean {
    return !!this.state.connectedAccounts[providerId];
  }

  // Get overlay network data (aggregated from all connected accounts)
  public getOverlayNetworkData() {
    const accounts = Object.values(this.state.connectedAccounts);
    
    return {
      totalAccounts: accounts.length,
      totalFollowers: accounts.reduce((sum, acc) => sum + (acc.stats?.followers || 0), 0),
      totalWorks: accounts.reduce((sum, acc) => sum + (acc.stats?.works || 0), 0),
      platforms: accounts.map(acc => acc.provider),
      portfolioUrls: accounts.filter(acc => acc.portfolioUrl).map(acc => ({
        provider: acc.provider,
        url: acc.portfolioUrl,
        username: acc.username
      })),
      socialPresence: accounts.reduce((presence, acc) => {
        presence[acc.provider] = {
          username: acc.username,
          followers: acc.stats?.followers || 0,
          url: acc.portfolioUrl
        };
        return presence;
      }, {} as Record<string, any>)
    };
  }
}