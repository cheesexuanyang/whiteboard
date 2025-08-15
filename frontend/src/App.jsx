import React from 'react';
import Whiteboard from './components/whiteboard/whiteboard';
import { SocketProvider } from './context/socketcontext';

function App() {
  return (
    <SocketProvider>
      <Whiteboard />
    </SocketProvider>
  );
}

export default App;