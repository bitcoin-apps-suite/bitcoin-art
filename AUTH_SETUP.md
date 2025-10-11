# Bitcoin Art Authentication Setup

## Overview

Bitcoin Art now includes a comprehensive multi-OAuth authentication system that allows artists to connect multiple accounts and create an "overlay network" of their artistic presence across platforms.

## Supported OAuth Providers

### 1. Google OAuth 2.0 ✅
- **Purpose**: Easy authentication and account management
- **Scopes**: `openid`, `profile`, `email`
- **Setup**: [Google Cloud Console](https://console.developers.google.com/)

### 2. DeviantArt OAuth 2.0 ✅
- **Purpose**: Import portfolio, connect with art community
- **Scopes**: `basic`, `browse`
- **Setup**: [DeviantArt Developer Portal](https://www.deviantart.com/developers/)
- **Features**: Portfolio import, follower stats, artwork sync

### 3. HandCash OAuth ✅
- **Purpose**: Bitcoin payments, identity verification, NFT minting
- **Scopes**: `profile`, `pay`
- **Setup**: [HandCash Developer Portal](https://app.handcash.io/developers)
- **Features**: Bitcoin payments, wallet integration, BSV transactions

### 4. Behance (Limited) ⚠️
- **Status**: OAuth discontinued by Adobe
- **Alternative**: Public API for portfolio display only
- **Note**: Cannot authenticate users, but can fetch public portfolios

### 5. ArtStation ❌
- **Status**: No public OAuth API available
- **Alternative**: Manual portfolio link entry

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing
3. Enable Google+ API and Google OAuth2 API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/callback/google`
6. Copy Client ID to `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
7. Copy Client Secret to `GOOGLE_CLIENT_SECRET`

### 3. DeviantArt OAuth Setup

1. Go to [DeviantArt Developers](https://www.deviantart.com/developers/)
2. Register a new application
3. Set redirect URI: `http://localhost:3000/auth/callback/deviantart`
4. Copy Client ID to `NEXT_PUBLIC_DEVIANTART_CLIENT_ID`
5. Copy Client Secret to `DEVIANTART_CLIENT_SECRET`

### 4. HandCash OAuth Setup

1. Go to [HandCash Developers](https://app.handcash.io/developers)
2. Create a new app
3. Set redirect URI: `http://localhost:3000/auth/callback/handcash`
4. Copy App ID to `NEXT_PUBLIC_HANDCASH_APP_ID`
5. Copy App Secret to `HANDCASH_APP_SECRET`

## Architecture

### MultiAuthService

The core authentication service (`src/services/MultiAuthService.ts`) handles:

- **Multiple Provider Support**: Connect Google, DeviantArt, HandCash simultaneously
- **State Management**: Centralized auth state with localStorage persistence
- **Token Management**: PKCE flow with secure token storage
- **User Profile Normalization**: Unified user data across providers
- **Overlay Network Data**: Aggregated stats from all connected accounts

### Key Components

1. **AuthModal** (`src/components/AuthModal.tsx`)
   - Multi-tab interface for provider connections
   - Real-time auth state updates
   - Network profile management

2. **ArtistProfileModal** (`src/components/ArtistProfileModal.tsx`)
   - Complete artist profile creation
   - Social links management
   - Portfolio stats display

3. **ArtworkUploadModal** (`src/components/ArtworkUploadModal.tsx`)
   - Multi-step artwork upload process
   - NFT configuration options
   - Pricing and licensing settings

4. **OAuth Callback Pages**
   - `src/app/auth/callback/google/page.tsx`
   - `src/app/auth/callback/deviantart/page.tsx`
   - `src/app/auth/callback/handcash/page.tsx`

## Features

### Overlay Network Approach

Artists can connect multiple platforms to create a unified presence:

- **Cross-Platform Stats**: Total followers, artworks across all platforms
- **Portfolio Aggregation**: Import existing artworks from DeviantArt
- **Identity Verification**: Bitcoin identity through HandCash
- **Payment Integration**: Bitcoin payments for art sales
- **Social Sharing**: Connect with existing artist communities

### Artist Profile System

- **Profile Creation**: Complete artist profiles with bio, avatar, cover image
- **Social Links**: Website, DeviantArt, Behance, Instagram, Twitter, etc.
- **Connected Accounts**: Visual display of all linked platforms
- **Portfolio Management**: Upload new artworks, manage existing ones
- **Stats Dashboard**: Followers, views, likes across all platforms

### Artwork Upload & Management

- **Multi-Step Upload**: File upload → Metadata → Pricing → NFT options
- **NFT Integration**: Bitcoin (BSV) and Ethereum NFT creation
- **Pricing Options**: USD, BSV, $BART token support
- **Licensing**: Creative Commons and rights management
- **Visibility Controls**: Public, private, unlisted options

## Usage

### For Artists

1. **Sign Up**: Connect one or more OAuth providers
2. **Profile Setup**: Complete artist profile with portfolio links
3. **Upload Art**: Use the comprehensive upload system
4. **Set Pricing**: Configure sale prices and royalties
5. **Create NFTs**: Optional blockchain minting
6. **Manage Network**: View aggregated stats across all platforms

### For Developers

```typescript
import { MultiAuthService } from '@/services/MultiAuthService';

const authService = new MultiAuthService();

// Listen to auth state changes
authService.subscribe((state) => {
  console.log('Auth state:', state);
  console.log('Connected accounts:', state.connectedAccounts);
  console.log('Overlay data:', authService.getOverlayNetworkData());
});

// Authenticate with a provider
await authService.authenticate('google');

// Get aggregated network data
const networkData = authService.getOverlayNetworkData();
console.log('Total followers:', networkData.totalFollowers);
console.log('Total artworks:', networkData.totalWorks);
```

## Security Considerations

- **PKCE Flow**: All OAuth flows use PKCE for enhanced security
- **State Validation**: Proper state parameter validation
- **Token Storage**: Secure token management with automatic cleanup
- **HTTPS Only**: Production requires HTTPS for OAuth callbacks
- **Domain Validation**: Redirect URIs must match registered domains

## Production Deployment

1. **Update Redirect URIs**: Change localhost to your production domain
2. **Environment Variables**: Set production OAuth credentials
3. **HTTPS**: Ensure SSL certificates are properly configured
4. **Domain Verification**: Verify domain ownership with OAuth providers
5. **Rate Limiting**: Implement proper rate limiting for OAuth endpoints

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**: Ensure URIs match exactly in OAuth provider settings
2. **CORS Errors**: Check domain configuration in OAuth provider dashboards
3. **State Parameter Errors**: Clear browser storage and try again
4. **Token Expiration**: Implement proper token refresh logic

### Debug Mode

Set environment variable to enable detailed logging:

```bash
NEXT_PUBLIC_DEBUG_AUTH=true
```

## Future Enhancements

- **Twitter OAuth**: Add Twitter authentication (requires Twitter API v2)
- **Instagram Integration**: Connect Instagram for additional portfolio sync
- **Automatic Portfolio Sync**: Scheduled imports from connected platforms
- **Advanced Analytics**: Detailed performance metrics across platforms
- **Collaboration Tools**: Artist-to-artist networking features

## Support

For issues or questions regarding the authentication system:

1. Check this documentation first
2. Review the code comments in `MultiAuthService.ts`
3. Create an issue in the GitHub repository
4. Contact the development team

---

**Note**: This is an "overlay network" approach - we're not trying to replace existing art platforms, but rather connect them together to give artists a unified presence across the Bitcoin ecosystem while maintaining their existing communities.