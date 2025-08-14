import React from 'react';
import ColorPicker from '../colorPicker/colourpicker';
import SizePicker from '../sizepicker/sizepicker';
import './toolbar.css';

function Toolbar({ 
  tool, 
  setTool, 
  color, 
  setColor, 
  brushSize, 
  setBrushSize, 
  onClear 
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-content">
        <div className="toolbar-row">
          {/* Tools */}
          <div className="tools-section">
            <button
              onClick={() => setTool('brush')}
              className={`tool-button ${tool === 'brush' ? 'active-brush' : ''}`}
            >
              🖌️ Brush
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`tool-button ${tool === 'eraser' ? 'active-eraser' : ''}`}
            >
              🧽 Eraser
            </button>
          </div>

          {/* Size Picker */}
          <SizePicker 
            brushSize={brushSize} 
            setBrushSize={setBrushSize} 
          />

          {/* Color Picker */}
          <ColorPicker 
            color={color} 
            setColor={setColor} 
          />

          {/* Clear Button */}
          <button
            onClick={onClear}
            className="clear-button"
          >
            🗑️ Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;