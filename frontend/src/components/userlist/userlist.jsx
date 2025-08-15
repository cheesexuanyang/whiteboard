import React, { useState } from 'react';
import { useSocket } from "../../context/socketcontext";
import './userlist.css';

function UserList() {
  const { connectedUsers, isConnected, socket, notifications, getInitials } = useSocket();
  const [showFullList, setShowFullList] = useState(false);

  if (!isConnected) {
    return null;
  }

  const displayUsers = showFullList ? connectedUsers : connectedUsers.slice(0, 5);
  const hasMoreUsers = connectedUsers.length > 5;

  return (
    <>
      {/* User List */}
      <div className="user-list-container">
        <div className="user-count">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{connectedUsers.length} user{connectedUsers.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="user-avatars">
          {displayUsers.map((user) => (
            <div
              key={user.id}
              className={`user-avatar ${user.id === socket?.id ? 'current-user' : ''}`}
              style={{ backgroundColor: user.avatarColor }}
              title={user.id === socket?.id ? `${user.name} (You)` : user.name}
              onClick={() => hasMoreUsers && !showFullList && setShowFullList(true)}
            >
              <span className="user-initials">
                {getInitials(user.name)}
              </span>
            </div>
          ))}
          {hasMoreUsers && !showFullList && (
            <div 
              className="more-users"
              onClick={() => setShowFullList(true)}
              title={`Click to see all ${connectedUsers.length} users`}
            >
              +{connectedUsers.length - 5}
            </div>
          )}
        </div>

        {/* Show full list when expanded */}
        {showFullList && hasMoreUsers && (
          <button 
            className="collapse-button"
            onClick={() => setShowFullList(false)}
            title="Show less users"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Expanded User List Dropdown */}
      {showFullList && (
        <>
          <div 
            className="user-list-backdrop" 
            onClick={() => setShowFullList(false)}
          />
          <div className="expanded-user-list">
            <div className="expanded-header">
              <h3>All Users ({connectedUsers.length})</h3>
              <button 
                onClick={() => setShowFullList(false)}
                className="close-expanded"
              >
                ×
              </button>
            </div>
            <div className="expanded-users">
              {connectedUsers.map((user) => (
                <div
                  key={user.id}
                  className={`expanded-user-item ${user.id === socket?.id ? 'current-user' : ''}`}
                >
                  <div
                    className="expanded-user-avatar"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    <span className="user-initials">
                      {getInitials(user.name)}
                    </span>
                  </div>
                  <div className="expanded-user-info">
                    <span className="expanded-user-name">
                      {user.name}
                      {user.id === socket?.id && <span className="you-badge">You</span>}
                    </span>
                    <span className="expanded-user-status">
                      {user.id === socket?.id ? 'Drawing' : 'Active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification ${notification.type}`}
          >
            <div className="notification-content">
              <span className="notification-message">{notification.message}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default UserList;