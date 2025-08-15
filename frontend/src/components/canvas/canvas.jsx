import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSocket } from "../../context/socketcontext";
import './canvas.css';

const Canvas = forwardRef(({ color, brushSize, tool }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const { socket, isConnected } = useSocket();

  // Set up canvas when component loads
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas background to white
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Listen for drawing events from other users
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleRemoteDrawing = (data) => {
      drawLine(data.from, data.to, data.color, data.brushSize, data.tool);
    };

    const handleRemoteClear = () => {
      clearCanvas();
    };

    const handleDrawingHistory = (history) => {
      // Replay drawing history for new users
      history.forEach(event => {
        if (event.from && event.to) {
          drawLine(event.from, event.to, event.color, event.brushSize, event.tool);
        }
      });
    };

    socket.on('drawing', handleRemoteDrawing);
    socket.on('clear-canvas', handleRemoteClear);
    socket.on('drawing-history', handleDrawingHistory);

    return () => {
      socket.off('drawing', handleRemoteDrawing);
      socket.off('clear-canvas', handleRemoteClear);
      socket.off('drawing-history', handleDrawingHistory);
    };
  }, [socket, isConnected]);

  // Get mouse position relative to canvas
  const getMousePosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Draw line on canvas
  const drawLine = (from, to, strokeColor, strokeWidth, drawTool) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set drawing style based on tool
    if (drawTool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = strokeWidth;
    } else {
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = strokeColor;
      context.lineWidth = strokeWidth;
    }
    
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // Draw line from last position to current position
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
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

    const currentPosition = getMousePosition(e);

    // Draw locally
    drawLine(lastPosition, currentPosition, color, brushSize, tool);

    // Emit drawing event to other users
    if (socket && isConnected) {
      socket.emit('drawing', {
        from: lastPosition,
        to: currentPosition,
        color: color,
        brushSize: brushSize,
        tool: tool
      });
    }

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
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Handle clear button click
  const handleClear = () => {
    clearCanvas();
    
    // Emit clear event to other users
    if (socket && isConnected) {
      socket.emit('clear-canvas');
    }
  };

  // Expose clear function to parent component
  useImperativeHandle(ref, () => ({
    clear: handleClear
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