import React, { useState, useRef } from 'react';
import Toolbar from '../toolbar/toolbar';
import Canvas from '../canvas/canvas';
import UserList from '../userList/UserList';
import WelcomeModal from '../welcome/welcome';
import { useSocket } from '../context/socketcontext';
import './whiteboard.css';

function Whiteboard() {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(20);
  const [tool, setTool] = useState('brush');
  const canvasRef = useRef(null);
  
  const { 
    showWelcomeModal, 
    isConnecting, 
    connectToSession, 
    isConnected 
  } = useSocket();

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const handleJoinSession = (userData) => {
    connectToSession(userData);
  };

  return (
    <div className="whiteboard-container">
      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={showWelcomeModal || isConnecting}
        onJoin={handleJoinSession}
      />
      
      {/* Main Whiteboard Interface - Only show when connected */}
      {isConnected && (
        <>
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
          <UserList />
        </>
      )}
      
      {/* Loading State */}
      {isConnecting && (
        <div className="connecting-overlay">
          <div className="connecting-message">
            <div className="connecting-spinner"></div>
            <p>Connecting to session...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Whiteboard;