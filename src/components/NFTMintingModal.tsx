'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface NFTMintingModalProps {
  isOpen: boolean;
  onClose: () => void;
  artworkData?: {
    title: string;
    image: string;
  };
}

export default function NFTMintingModal({ isOpen, onClose, artworkData }: NFTMintingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: artworkData?.title || '',
    description: '',
    royalty: 5,
    price: '',
    category: 'digital-art',
    tags: '',
    license: 'cc-by',
    unlockableContent: false,
    unlockableText: '',
    copyrightRegister: true,
    revenue_split: false,
    collaborators: ''
  });
  const [minting, setMinting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMinting(true);
    
    // Simulate minting process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setMinting(false);
    setStep(4); // Success step
  };

  const categories = [
    { value: 'digital-art', label: 'Digital Art' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'conceptual', label: 'Conceptual' },
    { value: 'photography', label: 'Photography' },
    { value: 'mixed-media', label: 'Mixed Media' }
  ];

  const licenses = [
    { value: 'cc-by', label: 'Creative Commons (CC BY)' },
    { value: 'cc-by-sa', label: 'Creative Commons (CC BY-SA)' },
    { value: 'cc-by-nc', label: 'Creative Commons (CC BY-NC)' },
    { value: 'all-rights-reserved', label: 'All Rights Reserved' },
    { value: 'public-domain', label: 'Public Domain' }
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Artwork Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter artwork title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
                  placeholder="Describe your artwork, inspiration, and story..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="abstract, colorful, modern"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Pricing & Royalties</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Initial Price (BSV)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.1"
                />
                <p className="text-xs text-gray-400 mt-1">Leave empty for auction-only listing</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Royalty Percentage: {formData.royalty}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.royalty}
                  onChange={(e) => setFormData({ ...formData, royalty: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1%</span>
                  <span>10%</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  You'll receive {formData.royalty}% of all future sales
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.revenue_split}
                    onChange={(e) => setFormData({ ...formData, revenue_split: e.target.checked })}
                    className="w-4 h-4 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-white font-medium">Enable Revenue Splitting</span>
                    <p className="text-xs text-gray-400">Share profits with collaborators</p>
                  </div>
                </label>
                
                {formData.revenue_split && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Collaborator Addresses (one per line)
                    </label>
                    <textarea
                      value={formData.collaborators}
                      onChange={(e) => setFormData({ ...formData, collaborators: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-20"
                      placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Rights & Features</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  License Type
                </label>
                <select
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {licenses.map((license) => (
                    <option key={license.value} value={license.value}>
                      {license.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.copyrightRegister}
                    onChange={(e) => setFormData({ ...formData, copyrightRegister: e.target.checked })}
                    className="w-4 h-4 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-white font-medium">Register Copyright on Blockchain</span>
                    <p className="text-xs text-gray-400">Immutable proof of creation timestamp</p>
                  </div>
                </label>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.unlockableContent}
                    onChange={(e) => setFormData({ ...formData, unlockableContent: e.target.checked })}
                    className="w-4 h-4 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-white font-medium">Include Unlockable Content</span>
                    <p className="text-xs text-gray-400">Special content only for the owner</p>
                  </div>
                </label>
                
                {formData.unlockableContent && (
                  <div className="mt-3">
                    <textarea
                      value={formData.unlockableText}
                      onChange={(e) => setFormData({ ...formData, unlockableText: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-20"
                      placeholder="Special message, high-res files, process videos, etc."
                    />
                  </div>
                )}
              </div>

              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-purple-300 font-medium mb-2">Minting Costs</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform Fee:</span>
                    <span className="text-white">0.001 BSV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network Fee:</span>
                    <span className="text-white">~0.0001 BSV</span>
                  </div>
                  {formData.copyrightRegister && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Copyright Registration:</span>
                      <span className="text-white">0.0005 BSV</span>
                    </div>
                  )}
                  <div className="border-t border-purple-500/30 pt-1 mt-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-purple-300">Total:</span>
                      <span className="text-purple-300">
                        {(0.001 + 0.0001 + (formData.copyrightRegister ? 0.0005 : 0)).toFixed(4)} BSV
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">NFT Minted Successfully!</h3>
              <p className="text-gray-300">Your artwork has been tokenized and is now available on the blockchain.</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <h4 className="text-white font-medium mb-3">NFT Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Token ID:</span>
                  <span className="text-white font-mono">#ART{Math.floor(Math.random() * 10000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Blockchain:</span>
                  <span className="text-white">Bitcoin SV</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction:</span>
                  <span className="text-purple-400 font-mono text-xs">
                    {Array(12).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  // Navigate to marketplace
                  window.location.href = '/?view=marketplace';
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                View in Marketplace
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 border border-purple-500 rounded-lg font-bold hover:bg-purple-500/10 transition-colors"
              >
                Create Another NFT
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Mint as NFT</h2>
            {step < 4 && (
              <p className="text-gray-400 text-sm mt-1">Step {step} of 3</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress bar */}
        {step < 4 && (
          <div className="px-6 py-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`flex-1 h-2 rounded-full ${
                    stepNum <= step ? 'bg-purple-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {minting ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">Minting your NFT...</h3>
              <p className="text-gray-400">This may take a few moments</p>
            </div>
          ) : (
            renderStep()
          )}

          {/* Navigation */}
          {!minting && step < 4 && (
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                className="px-6 py-3 border border-gray-600 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!formData.title || !formData.description}
                  className="px-6 py-3 bg-purple-500 rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                  Mint NFT
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}