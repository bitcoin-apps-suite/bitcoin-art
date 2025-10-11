'use client';

import { useState, useEffect } from 'react';
import { X, Upload, User, Link, Globe, Palette, Heart, Eye, Download } from 'lucide-react';

interface ArtistProfile {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  coverImage?: string;
  website?: string;
  socialLinks: {
    deviantart?: string;
    behance?: string;
    artstation?: string;
    instagram?: string;
    twitter?: string;
  };
  connectedAccounts: {
    handcash?: { connected: boolean; profile?: any };
    google?: { connected: boolean; profile?: any };
    deviantart?: { connected: boolean; profile?: any };
  };
  stats: {
    artworks: number;
    followers: number;
    likes: number;
    views: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface ArtistProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistId?: string;
  onSave?: (profile: ArtistProfile) => void;
}

export default function ArtistProfileModal({ 
  isOpen, 
  onClose, 
  artistId, 
  onSave 
}: ArtistProfileModalProps) {
  const [profile, setProfile] = useState<ArtistProfile>({
    id: artistId || '',
    name: '',
    bio: '',
    socialLinks: {},
    connectedAccounts: {},
    stats: { artworks: 0, followers: 0, likes: 0, views: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'accounts' | 'portfolio'>('profile');
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      updatedAt: new Date().toISOString()
    };
    onSave?.(updatedProfile);
    onClose();
  };

  const handleImageUpload = async (type: 'avatar' | 'cover', file: File) => {
    setUploading(true);
    try {
      // In a real implementation, upload to cloud storage
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({
        ...prev,
        [type === 'avatar' ? 'avatar' : 'coverImage']: imageUrl
      }));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const connectAccount = async (provider: 'handcash' | 'google' | 'deviantart') => {
    try {
      // OAuth flow implementation would go here
      console.log(`Connecting to ${provider}...`);
      
      // Mock connection for demo
      setProfile(prev => ({
        ...prev,
        connectedAccounts: {
          ...prev.connectedAccounts,
          [provider]: { connected: true, profile: { name: `${provider} User` } }
        }
      }));
    } catch (error) {
      console.error(`Failed to connect ${provider}:`, error);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Palette size={24} color="#8b5cf6" />
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Artist Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
          }}
        >
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'accounts', label: 'Connected Accounts', icon: Link },
            { id: 'portfolio', label: 'Portfolio', icon: Palette }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              style={{
                flex: 1,
                padding: '16px',
                background: activeTab === id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                border: 'none',
                color: activeTab === id ? '#8b5cf6' : '#888',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: activeTab === id ? '600' : '400',
                borderBottom: activeTab === id ? '2px solid #8b5cf6' : '2px solid transparent'
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Cover Image */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#8b5cf6', fontSize: '14px', fontWeight: '600' }}>
                  Cover Image
                </label>
                <div
                  style={{
                    height: '120px',
                    background: profile.coverImage 
                      ? `url(${profile.coverImage}) center/cover` 
                      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(192, 132, 252, 0.1))',
                    borderRadius: '12px',
                    border: '2px dashed rgba(139, 92, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleImageUpload('cover', file);
                    };
                    input.click();
                  }}
                >
                  {!profile.coverImage && (
                    <div style={{ textAlign: 'center', color: '#8b5cf6' }}>
                      <Upload size={24} />
                      <div style={{ marginTop: '8px', fontSize: '14px' }}>Upload Cover Image</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar and Name */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#8b5cf6', fontSize: '14px', fontWeight: '600' }}>
                    Avatar
                  </label>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: profile.avatar 
                        ? `url(${profile.avatar}) center/cover` 
                        : 'linear-gradient(135deg, #8b5cf6, #c084fc)',
                      border: '3px solid rgba(139, 92, 246, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'white'
                    }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleImageUpload('avatar', file);
                      };
                      input.click();
                    }}
                  >
                    {!profile.avatar && <User size={32} />}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#8b5cf6', fontSize: '14px', fontWeight: '600' }}>
                      Artist Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px'
                      }}
                      placeholder="Enter your artist name"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#8b5cf6', fontSize: '14px', fontWeight: '600' }}>
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                      placeholder="Tell us about yourself and your art..."
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 style={{ color: '#8b5cf6', marginBottom: '16px', fontSize: '18px' }}>Social Links</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  {[
                    { key: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
                    { key: 'deviantart', label: 'DeviantArt', placeholder: 'https://deviantart.com/username' },
                    { key: 'behance', label: 'Behance', placeholder: 'https://behance.net/username' },
                    { key: 'artstation', label: 'ArtStation', placeholder: 'https://artstation.com/username' },
                    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
                    { key: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/username' }
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label style={{ display: 'block', marginBottom: '6px', color: '#888', fontSize: '13px' }}>
                        {label}
                      </label>
                      <input
                        type="url"
                        value={(profile.socialLinks as any)[key] || ''}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, [key]: e.target.value }
                        }))}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '14px'
                        }}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ color: '#8b5cf6', marginBottom: '16px', fontSize: '18px' }}>
                Connect Your Accounts
              </h3>
              <p style={{ color: '#888', marginBottom: '20px', lineHeight: '1.5' }}>
                Connect your external accounts to import your existing portfolio and enable cross-platform features.
              </p>

              {[
                {
                  provider: 'handcash',
                  name: 'HandCash',
                  description: 'Connect for Bitcoin payments and identity verification',
                  color: '#00d4aa',
                  available: true
                },
                {
                  provider: 'google',
                  name: 'Google',
                  description: 'Sign in with Google for easy authentication',
                  color: '#4285f4',
                  available: true
                },
                {
                  provider: 'deviantart',
                  name: 'DeviantArt',
                  description: 'Import your DeviantArt portfolio and connect with the community',
                  color: '#05cc47',
                  available: true
                }
              ].map(({ provider, name, description, color, available }) => {
                const isConnected = profile.connectedAccounts[provider as keyof typeof profile.connectedAccounts]?.connected;
                
                return (
                  <div
                    key={provider}
                    style={{
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isConnected ? color : 'rgba(139, 92, 246, 0.2)'}`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${color}, ${color}88)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '18px'
                        }}
                      >
                        {name[0]}
                      </div>
                      <div>
                        <h4 style={{ color: 'white', margin: 0, fontSize: '16px', fontWeight: '600' }}>
                          {name}
                        </h4>
                        <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
                          {description}
                        </p>
                        {isConnected && (
                          <p style={{ color: color, margin: '4px 0 0 0', fontSize: '12px', fontWeight: '600' }}>
                            ✓ Connected
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => connectAccount(provider as any)}
                      disabled={!available}
                      style={{
                        padding: '10px 20px',
                        background: isConnected 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : `linear-gradient(135deg, ${color}, ${color}88)`,
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: available ? 'pointer' : 'not-allowed',
                        fontWeight: '600',
                        opacity: available ? 1 : 0.5
                      }}
                    >
                      {isConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ color: '#8b5cf6', margin: 0, fontSize: '18px' }}>
                  Portfolio Stats
                </h3>
                <button
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Upload size={16} />
                  Upload Artwork
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                {[
                  { label: 'Artworks', value: profile.stats.artworks, icon: Palette, color: '#8b5cf6' },
                  { label: 'Followers', value: profile.stats.followers, icon: User, color: '#06b6d4' },
                  { label: 'Likes', value: profile.stats.likes, icon: Heart, color: '#ef4444' },
                  { label: 'Views', value: profile.stats.views, icon: Eye, color: '#10b981' }
                ].map(({ label, value, icon: Icon, color }) => (
                  <div
                    key={label}
                    style={{
                      padding: '20px',
                      background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                      border: `1px solid ${color}40`,
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}
                  >
                    <Icon size={24} color={color} style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                      {value.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '16px' }}>Recent Uploads</h4>
                <div style={{ 
                  padding: '40px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '2px dashed rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  color: '#888'
                }}>
                  <Palette size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p>No artworks uploaded yet</p>
                  <p style={{ fontSize: '14px' }}>Upload your first artwork to get started!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '24px',
            borderTop: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#8b5cf6',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}