import React from 'react';
import './sizepicker.css';

function SizePicker({ brushSize, setBrushSize }) {
  const sizePresets = [2, 5, 10, 15, 20];

  return (
    <div className="size-section">
      <span className="size-label">Size:</span>
      {sizePresets.map((size) => (
        <button
          key={size}
          onClick={() => setBrushSize(size)}
          className={`size-button ${brushSize === size ? 'active' : ''}`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}

export default SizePicker;