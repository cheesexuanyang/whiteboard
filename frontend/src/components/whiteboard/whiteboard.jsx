import React, { useState, useRef } from 'react';
import Toolbar from '../toolbar/toolbar';
import Canvas from '../canvas/canvas';
import UserList from '../userlist/userlist';
import WelcomeModal from '../welcome/welcome';
import { useSocket } from '../../context/socketcontext';
import './whiteboard.css';

function Whiteboard() {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
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
        <div
          className="connecting-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998
          }}
        >
          <div
            className="connecting-message"
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <div
              className="connecting-spinner"
              style={{
                width: '24px',
                height: '24px',
                border: '2px solid #f3f4f6',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}
            />
            <p style={{ margin: 0, color: '#374151' }}>
              Connecting to session…
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Whiteboard;
