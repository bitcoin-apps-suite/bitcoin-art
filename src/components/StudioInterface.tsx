'use client';

import { useState } from 'react';
import {
  Brush,
  Palette,
  PenTool,
  Square,
  
  Type,
  Eraser,
  Download,
  
  Save,
  Undo,
  Redo,
  Layers,
  
  Sparkles,
  
  Grid,
} from 'lucide-react';

export default function StudioInterface() {
  const [selectedTool, setSelectedTool] = useState('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [selectedColor, setSelectedColor] = useState('#8b5cf6');
  const [layers] = useState([{ id: 1, name: 'Layer 1', visible: true, opacity: 100 }]);

  const tools = [
    { id: 'brush', icon: Brush, label: 'Brush' },
    { id: 'pen', icon: PenTool, label: 'Pen Tool' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'shape', icon: Square, label: 'Shapes' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'select', icon: Grid, label: 'Select' },
  ];

  const colors = [
    '#8b5cf6', '#c084fc', '#e5e7eb', '#ff4500',
    '#dc143c', '#8b008b', '#4b0082', '#0000ff',
    '#00ced1', '#00ff00', '#ffff00', '#ffffff',
    '#808080', '#000000',
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0a0a' }}>
      {/* Top Toolbar */}
      <div
        style={{
          height: '60px',
          background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        {/* Left Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            style={{
              padding: '8px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#8b5cf6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Undo size={18} />
          </button>
          <button
            style={{
              padding: '8px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#8b5cf6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Redo size={18} />
          </button>
        </div>

        {/* Center Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={20} color="#8b5cf6" />
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', margin: 0 }}>
            Art Studio - Untitled Artwork
          </h2>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
            }}
          >
            <Sparkles size={16} />
            AI Enhance
          </button>
          <button
            style={{
              padding: '8px 16px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#8b5cf6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Save size={16} />
            Save
          </button>
          <button
            style={{
              padding: '8px 16px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#8b5cf6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Toolbox */}
        <div
          style={{
            width: '80px',
            background: '#141414',
            borderRight: '1px solid rgba(139, 92, 246, 0.2)',
            padding: '16px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              style={{
                width: '64px',
                height: '64px',
                background: selectedTool === tool.id ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                border: selectedTool === tool.id ? '2px solid #8b5cf6' : '2px solid transparent',
                borderRadius: '8px',
                color: selectedTool === tool.id ? '#8b5cf6' : '#999',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.2s',
              }}
            >
              <tool.icon size={24} />
              <span style={{ fontSize: '10px' }}>{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Canvas Area */}
        <div
          style={{
            flex: 1,
            background: '#0f0f0f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '800px',
              height: '600px',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <canvas
              style={{ width: '100%', height: '100%' }}
              onMouseDown={() => {
                // Canvas drawing logic would go here
                console.log('Canvas interaction');
              }}
            />
            {/* Canvas Placeholder */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ccc',
                fontSize: '18px',
                fontWeight: 500,
              }}
            >
              Click and drag to start creating
            </div>
          </div>

          {/* Zoom Controls */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              display: 'flex',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.8)',
              padding: '8px',
              borderRadius: '8px',
            }}
          >
            <button
              style={{
                padding: '8px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '4px',
                color: '#8b5cf6',
                cursor: 'pointer',
              }}
            >
              -
            </button>
            <span style={{ padding: '8px', color: '#999' }}>100%</span>
            <button
              style={{
                padding: '8px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '4px',
                color: '#8b5cf6',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div
          style={{
            width: '280px',
            background: '#141414',
            borderLeft: '1px solid rgba(139, 92, 246, 0.2)',
            padding: '16px',
            overflowY: 'auto',
          }}
        >
          {/* Color Palette */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', color: '#8b5cf6', marginBottom: '12px' }}>
              Colors
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '32px',
                    height: '32px',
                    background: color,
                    border: selectedColor === color ? '2px solid #fff' : '2px solid transparent',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Brush Settings */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', color: '#8b5cf6', marginBottom: '12px' }}>
              Brush Settings
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>
                Size: {brushSize}px
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>
                Opacity: 100%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="100"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Layers */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', color: '#8b5cf6', margin: 0 }}>
                Layers
              </h3>
              <button
                style={{
                  padding: '4px 8px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '4px',
                  color: '#8b5cf6',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                + Add
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  style={{
                    padding: '12px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Layers size={16} color="#8b5cf6" />
                  <span style={{ flex: 1, fontSize: '13px', color: '#ccc' }}>{layer.name}</span>
                  <input
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() => {}}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}