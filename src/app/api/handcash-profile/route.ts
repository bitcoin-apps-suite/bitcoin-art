import { NextRequest, NextResponse } from 'next/server';

interface HandCashUser {
  handle: string;
  paymail: string;
  publicKey?: string;
  avatarUrl?: string;
  displayName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { authToken } = await request.json();

    if (!authToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'No auth token provided' 
      }, { status: 400 });
    }

    console.log('Fetching HandCash profile with token:', authToken.substring(0, 20) + '...');

    // Use HandCash Connect API to fetch user profile
    const response = await fetch('https://connect.handcash.io/v3/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('HandCash API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      return NextResponse.json({ 
        success: false, 
        error: `HandCash API error: ${response.statusText}`,
        details: errorText
      }, { status: response.status });
    }

    const profileData = await response.json();
    console.log('HandCash profile data received:', profileData);

    // Transform the data to match our interface
    const profile: HandCashUser = {
      handle: profileData.handle || profileData.alias || 'unknown',
      paymail: profileData.paymail || `${profileData.handle || 'user'}@handcash.io`,
      publicKey: profileData.publicKey || profileData.id,
      avatarUrl: profileData.avatarUrl || profileData.avatar,
      displayName: profileData.displayName || profileData.name || profileData.handle
    };

    return NextResponse.json({ 
      success: true, 
      profile 
    });

  } catch (error: any) {
    console.error('Profile fetch error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch profile',
      details: error.message
    }, { status: 500 });
  }
}