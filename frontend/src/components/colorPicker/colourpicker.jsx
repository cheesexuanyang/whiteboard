import React from 'react';
import './colourpicker.css';

function ColorPicker({ color, setColor }) {
  const presetColors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#8B4513', '#808080'
  ];

  return (
    <div className="colors-section">
      <span className="colors-label">Colors:</span>
      {presetColors.map((presetColor) => (
        <button
          key={presetColor}
          onClick={() => setColor(presetColor)}
          className={`color-button ${color === presetColor ? 'active' : ''}`}
          style={{ backgroundColor: presetColor }}
        />
      ))}
      {/* Custom Color Picker */}
      <div className="custom-color-container">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="custom-color-input"
        />
        <div 
          className={`custom-color-display ${!presetColors.includes(color) ? 'active' : ''}`}
          style={{ 
            backgroundColor: !presetColors.includes(color) ? color : '#f3f4f6',
            background: !presetColors.includes(color) ? color : 'linear-gradient(45deg, #ff0000 25%, #00ff00 25%, #00ff00 50%, #0000ff 50%, #0000ff 75%, #ffff00 75%)'
          }}
        >
          {presetColors.includes(color) && (
            <span className="custom-color-plus">+</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;