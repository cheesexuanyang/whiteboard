import React from 'react';
import './sizepicker.css';

function SizePicker({ brushSize, setBrushSize }) {
  const sizePresets = [2, 5, 10, 15, 20];

  return (
    <div className="size-section">
      <span className="size-label">Size:</span>
      <div className="size-dots-container">
        {sizePresets.map((size) => (
          <button
            key={size}
            onClick={() => setBrushSize(size)}
            className={`size-dot-button ${brushSize === size ? 'active' : ''}`}
            title={`Size ${size}`}
          >
            <div 
              className="size-dot"
              style={{ 
                width: `${Math.min(size, 24)}px`, 
                height: `${Math.min(size, 24)}px` 
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default SizePicker;