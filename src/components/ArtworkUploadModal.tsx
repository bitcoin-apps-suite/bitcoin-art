'use client';

import { useState, useCallback } from 'react';
import { X, Upload, Image, Tag, DollarSign, Clock, Eye, EyeOff, Bitcoin, Globe } from 'lucide-react';

interface ArtworkMetadata {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  medium: string;
  dimensions?: {
    width: number;
    height: number;
    unit: 'px' | 'cm' | 'in';
  };
  pricing?: {
    forSale?: boolean;
    price?: number;
    currency?: 'USD' | 'BSV' | 'BART';
    royalty?: number;
  };
  visibility: 'public' | 'private' | 'unlisted';
  licensing: 'all-rights-reserved' | 'cc-by' | 'cc-by-sa' | 'cc-by-nc' | 'cc0';
  nft?: {
    enabled?: boolean;
    blockchain?: 'bitcoin' | 'ethereum';
    collection?: string;
  };
  file: {
    url: string;
    type: string;
    size: number;
    hash?: string;
  };
  createdAt: string;
}

interface ArtworkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (artwork: ArtworkMetadata) => void;
}

export default function ArtworkUploadModal({ 
  isOpen, 
  onClose, 
  onUpload 
}: ArtworkUploadModalProps) {
  const [step, setStep] = useState<'upload' | 'metadata' | 'pricing' | 'nft'>('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  
  const [artwork, setArtwork] = useState<Partial<ArtworkMetadata>>({
    title: '',
    description: '',
    tags: [],
    category: 'digital-art',
    medium: 'digital',
    pricing: {
      forSale: false,
      currency: 'USD'
    },
    visibility: 'public',
    licensing: 'all-rights-reserved',
    nft: {
      enabled: false,
      blockchain: 'bitcoin'
    }
  });

  if (!isOpen) return null;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // In a real implementation, upload to cloud storage and get URL
      const imageUrl = URL.createObjectURL(file);
      
      setArtwork(prev => ({
        ...prev,
        file: {
          url: imageUrl,
          type: file.type,
          size: file.size
        }
      }));

      setStep('metadata');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleInputUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileUpload(file);
    };
    input.click();
  };

  const addTag = (tag: string) => {
    if (tag && !artwork.tags?.includes(tag)) {
      setArtwork(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setArtwork(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = () => {
    const completeArtwork: ArtworkMetadata = {
      id: Date.now().toString(),
      ...artwork,
      createdAt: new Date().toISOString()
    } as ArtworkMetadata;

    onUpload?.(completeArtwork);
    onClose();
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
          maxWidth: '900px',
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
            <Upload size={24} color="#8b5cf6" />
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Upload Artwork
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

        {/* Progress Steps */}
        <div
          style={{
            display: 'flex',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
          }}
        >
          {[
            { id: 'upload', label: 'Upload File', icon: Upload },
            { id: 'metadata', label: 'Details', icon: Tag },
            { id: 'pricing', label: 'Pricing', icon: DollarSign },
            { id: 'nft', label: 'NFT Options', icon: Bitcoin }
          ].map(({ id, label, icon: Icon }, index) => {
            const isActive = step === id;
            const isCompleted = ['upload', 'metadata', 'pricing', 'nft'].indexOf(step) > index;
            
            return (
              <div
                key={id}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: isActive ? '#8b5cf6' : isCompleted ? '#10b981' : '#666',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isActive 
                      ? 'linear-gradient(135deg, #8b5cf6, #c084fc)'
                      : isCompleted 
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <Icon size={16} />
                </div>
                <span>{label}</span>
                {index < 3 && (
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      background: isCompleted ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                      marginLeft: '16px'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {step === 'upload' && (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  border: `2px dashed ${dragActive ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)'}`,
                  borderRadius: '16px',
                  padding: '60px 40px',
                  background: dragActive ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '24px'
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleInputUpload}
              >
                {uploading ? (
                  <div>
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        border: '4px solid rgba(139, 92, 246, 0.2)',
                        borderTop: '4px solid #8b5cf6',
                        borderRadius: '50%',
                        margin: '0 auto 20px',
                        animation: 'spin 1s linear infinite'
                      }}
                    />
                    <p style={{ color: '#8b5cf6', fontSize: '18px', marginBottom: '8px' }}>
                      Uploading... {uploadProgress}%
                    </p>
                    <div
                      style={{
                        width: '200px',
                        height: '8px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        borderRadius: '4px',
                        margin: '0 auto',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${uploadProgress}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #8b5cf6, #c084fc)',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Image size={64} color="#8b5cf6" style={{ marginBottom: '20px' }} />
                    <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '20px' }}>
                      Drop your artwork here
                    </h3>
                    <p style={{ color: '#888', marginBottom: '20px', lineHeight: '1.5' }}>
                      Drag and drop your image file, or click to browse.<br />
                      Supports JPG, PNG, GIF, and SVG files up to 50MB.
                    </p>
                    <button
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '16px'
                      }}
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>

              <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                <p><strong>Supported formats:</strong> JPEG, PNG, GIF, SVG</p>
                <p><strong>Maximum file size:</strong> 50 MB</p>
                <p><strong>Recommended dimensions:</strong> At least 1000px for best quality</p>
              </div>
            </div>
          )}

          {step === 'metadata' && artwork.file && (
            <div style={{ display: 'flex', gap: '32px' }}>
              {/* Preview */}
              <div style={{ flex: '0 0 300px' }}>
                <img
                  src={artwork.file.url}
                  alt="Preview"
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}
                />
              </div>

              {/* Form */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#8b5cf6', fontWeight: '600' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={artwork.title || ''}
                    onChange={(e) => setArtwork(prev => ({ ...prev, title: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                    placeholder="Enter artwork title"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#8b5cf6', fontWeight: '600' }}>
                    Description
                  </label>
                  <textarea
                    value={artwork.description || ''}
                    onChange={(e) => setArtwork(prev => ({ ...prev, description: e.target.value }))}
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                    placeholder="Describe your artwork..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#8b5cf6', fontWeight: '600' }}>
                      Category
                    </label>
                    <select
                      value={artwork.category || ''}
                      onChange={(e) => setArtwork(prev => ({ ...prev, category: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    >
                      <option value="digital-art">Digital Art</option>
                      <option value="photography">Photography</option>
                      <option value="illustration">Illustration</option>
                      <option value="3d-art">3D Art</option>
                      <option value="pixel-art">Pixel Art</option>
                      <option value="abstract">Abstract</option>
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#8b5cf6', fontWeight: '600' }}>
                      Medium
                    </label>
                    <select
                      value={artwork.medium || ''}
                      onChange={(e) => setArtwork(prev => ({ ...prev, medium: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    >
                      <option value="digital">Digital</option>
                      <option value="oil">Oil Paint</option>
                      <option value="acrylic">Acrylic</option>
                      <option value="watercolor">Watercolor</option>
                      <option value="pencil">Pencil</option>
                      <option value="charcoal">Charcoal</option>
                      <option value="mixed-media">Mixed Media</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#8b5cf6', fontWeight: '600' }}>
                    Tags
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    {artwork.tags?.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 12px',
                          background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
                          borderRadius: '16px',
                          color: 'white',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '14px'
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '6px',
                      color: 'white'
                    }}
                    placeholder="Add tags (press Enter)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        addTag(input.value.trim());
                        input.value = '';
                      }
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#8b5cf6', fontWeight: '600' }}>
                    Visibility
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {[
                      { value: 'public', label: 'Public', icon: Globe },
                      { value: 'unlisted', label: 'Unlisted', icon: EyeOff },
                      { value: 'private', label: 'Private', icon: Eye }
                    ].map(({ value, label, icon: Icon }) => (
                      <label
                        key={value}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: artwork.visibility === value ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${artwork.visibility === value ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: 'white'
                        }}
                      >
                        <input
                          type="radio"
                          value={value}
                          checked={artwork.visibility === value}
                          onChange={(e) => setArtwork(prev => ({ ...prev, visibility: e.target.value as any }))}
                          style={{ display: 'none' }}
                        />
                        <Icon size={16} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'pricing' && (
            <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '20px' }}>Pricing Options</h3>
                <p style={{ color: '#888', marginBottom: '24px', lineHeight: '1.5' }}>
                  Set your pricing preferences for this artwork. You can change these settings later.
                </p>
              </div>

              <div
                style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '12px'
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <input
                    type="checkbox"
                    checked={artwork.pricing?.forSale || false}
                    onChange={(e) => setArtwork(prev => ({
                      ...prev,
                      pricing: { ...prev.pricing, forSale: e.target.checked }
                    }))}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                    Make this artwork available for sale
                  </span>
                </label>

                {artwork.pricing?.forSale && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#8b5cf6', fontSize: '14px' }}>
                          Price
                        </label>
                        <input
                          type="number"
                          value={artwork.pricing?.price || ''}
                          onChange={(e) => setArtwork(prev => ({
                            ...prev,
                            pricing: { ...prev.pricing, price: parseFloat(e.target.value) }
                          }))}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#8b5cf6', fontSize: '14px' }}>
                          Currency
                        </label>
                        <select
                          value={artwork.pricing?.currency || 'USD'}
                          onChange={(e) => setArtwork(prev => ({
                            ...prev,
                            pricing: { ...prev.pricing, currency: e.target.value as any }
                          }))}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        >
                          <option value="USD">USD</option>
                          <option value="BSV">BSV</option>
                          <option value="BART">$BART</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', color: '#8b5cf6', fontSize: '14px' }}>
                        Royalty Percentage (for resales)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={artwork.pricing?.royalty || ''}
                        onChange={(e) => setArtwork(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, royalty: parseFloat(e.target.value) }
                        }))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                        placeholder="10"
                      />
                      <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                        Percentage you'll receive from future sales (0-50%)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#8b5cf6', fontWeight: '600' }}>
                  Licensing
                </label>
                <select
                  value={artwork.licensing || 'all-rights-reserved'}
                  onChange={(e) => setArtwork(prev => ({ ...prev, licensing: e.target.value as any }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                >
                  <option value="all-rights-reserved">All Rights Reserved</option>
                  <option value="cc-by">Creative Commons - Attribution</option>
                  <option value="cc-by-sa">Creative Commons - Attribution ShareAlike</option>
                  <option value="cc-by-nc">Creative Commons - Attribution NonCommercial</option>
                  <option value="cc0">Creative Commons - Public Domain</option>
                </select>
              </div>
            </div>
          )}

          {step === 'nft' && (
            <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '20px' }}>NFT Options</h3>
                <p style={{ color: '#888', marginBottom: '24px', lineHeight: '1.5' }}>
                  Transform your artwork into an NFT on the blockchain for additional ownership verification and trading capabilities.
                </p>
              </div>

              <div
                style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '12px'
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <input
                    type="checkbox"
                    checked={artwork.nft?.enabled || false}
                    onChange={(e) => setArtwork(prev => ({
                      ...prev,
                      nft: { ...prev.nft, enabled: e.target.checked }
                    }))}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                    Create NFT for this artwork
                  </span>
                </label>

                {artwork.nft?.enabled && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#8b5cf6', fontSize: '14px' }}>
                        Blockchain
                      </label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {[
                          { value: 'bitcoin', label: 'Bitcoin (BSV)', desc: 'Low fees, fast transactions' },
                          { value: 'ethereum', label: 'Ethereum', desc: 'Largest NFT ecosystem' }
                        ].map(({ value, label, desc }) => (
                          <label
                            key={value}
                            style={{
                              flex: 1,
                              padding: '16px',
                              background: artwork.nft?.blockchain === value ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                              border: `1px solid ${artwork.nft?.blockchain === value ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)'}`,
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px'
                            }}
                          >
                            <input
                              type="radio"
                              value={value}
                              checked={artwork.nft?.blockchain === value}
                              onChange={(e) => setArtwork(prev => ({
                                ...prev,
                                nft: { ...prev.nft, blockchain: e.target.value as any }
                              }))}
                              style={{ display: 'none' }}
                            />
                            <div style={{ color: 'white', fontWeight: '600' }}>{label}</div>
                            <div style={{ color: '#888', fontSize: '12px' }}>{desc}</div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#8b5cf6', fontSize: '14px' }}>
                        Collection (Optional)
                      </label>
                      <input
                        type="text"
                        value={artwork.nft?.collection || ''}
                        onChange={(e) => setArtwork(prev => ({
                          ...prev,
                          nft: { ...prev.nft, collection: e.target.value }
                        }))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                        placeholder="Enter collection name"
                      />
                      <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                        Group this artwork with others in a collection
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  borderRadius: '8px',
                  color: '#ffc107'
                }}
              >
                <p style={{ margin: 0, fontSize: '14px' }}>
                  <strong>Note:</strong> NFT creation requires blockchain transaction fees. 
                  Bitcoin NFTs typically cost less than $0.01 while Ethereum can vary significantly.
                </p>
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
          
          {step !== 'upload' && (
            <button
              onClick={() => {
                const steps = ['upload', 'metadata', 'pricing', 'nft'];
                const currentIndex = steps.indexOf(step);
                if (currentIndex > 0) {
                  setStep(steps[currentIndex - 1] as any);
                }
              }}
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Back
            </button>
          )}

          {step !== 'nft' ? (
            <button
              onClick={() => {
                const steps = ['upload', 'metadata', 'pricing', 'nft'];
                const currentIndex = steps.indexOf(step);
                if (currentIndex < steps.length - 1) {
                  setStep(steps[currentIndex + 1] as any);
                }
              }}
              disabled={step === 'upload' && !artwork.file}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                opacity: (step === 'upload' && !artwork.file) ? 0.5 : 1
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!artwork.title}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                opacity: !artwork.title ? 0.5 : 1
              }}
            >
              Upload Artwork
            </button>
          )}
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}