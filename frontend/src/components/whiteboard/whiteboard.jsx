import React, { useState, useRef } from 'react';
import Toolbar from './toolbar/Toolbar';
import Canvas from './canvas/Canvas';
import './whiteboard.css';

function Whiteboard() {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(20);
  const [tool, setTool] = useState('brush');
  const canvasRef = useRef(null);

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  return (
    <div className="whiteboard-container">
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        onClear={handleClear}
      />
      <Canvas
        ref={canvasRef}
        color={color}
        brushSize={brushSize}
        tool={tool}
      />
    </div>
  );
}

export default Whiteboard;