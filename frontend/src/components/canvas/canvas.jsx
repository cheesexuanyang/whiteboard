import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './Canvas.css';

const Canvas = forwardRef(({ color, brushSize, tool }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  // Set up canvas when component loads
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas background to white
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Get mouse position relative to canvas
  const getMousePosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Start drawing
  const startDrawing = (e) => {
    setIsDrawing(true);
    const position = getMousePosition(e);
    setLastPosition(position);
  };

  // Draw on canvas
  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const currentPosition = getMousePosition(e);

    // Set drawing style based on tool
    if (tool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = brushSize;
    } else {
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = color;
      context.lineWidth = brushSize;
    }
    
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // Draw line from last position to current position
    context.beginPath();
    context.moveTo(lastPosition.x, lastPosition.y);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();

    setLastPosition(currentPosition);
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Expose clear function to parent component
  useImperativeHandle(ref, () => ({
    clear: clearCanvas
  }));

  return (
    <div className="canvas-container">
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={900}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="canvas"
        />
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;