import React, { useState, useEffect } from 'react';
import { useSocket } from "../../context/socketcontext";
import './welcome.css';

function WelcomeModal({ isOpen, onJoin }) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatarColor, setAvatarColor] = useState('#3B82F6');
  
  const { generateAvatarColor, getInitials } = useSocket();

  // Generate random avatar color on mount
  useEffect(() => {
    setAvatarColor(generateAvatarColor());
  }, [generateAvatarColor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    
    // Validation
    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    if (trimmedName.length > 30) {
      setError('Name must be less than 30 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate brief loading for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onJoin({
        name: trimmedName,
        avatarColor: avatarColor
      });
    } catch (err) {
      setError('Failed to join session. Please try again.');
      setIsLoading(false);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (error) setError(''); // Clear error on input
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="modal-title">Join Collaborative Whiteboard</h2>
          <p className="modal-subtitle">
            Enter your name to start collaborating with others in real-time
          </p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <div className="input-with-avatar">
              <div 
                className="avatar-preview"
                style={{ backgroundColor: avatarColor }}
              >
                <span className="avatar-initials">
                  {name.trim() ? getInitials(name) : '?'}
                </span>
              </div>
              <div className="input-container">
                <label htmlFor="userName" className="input-label">
                  Your Name
                </label>
                <input
                  id="userName"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your full name"
                  className={`name-input ${error ? 'error' : ''}`}
                  disabled={isLoading}
                  autoFocus
                  maxLength={30}
                />
                {error && <span className="error-message">{error}</span>}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={() => setAvatarColor(generateAvatarColor())}
              className="secondary-button"
              disabled={isLoading}
            >
              🎨 Change Color
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Joining...
                </>
              ) : (
                'Join Session'
              )}
            </button>
          </div>
        </form>

        <div className="modal-footer">
          <p className="footer-text">
            Your drawing will be visible to all participants in real-time
          </p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeModal;