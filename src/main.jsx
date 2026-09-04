import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { StudyAppProvider } from './context/StudyAppContext';
import { ChatProvider } from './context/ChatContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StudyAppProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </StudyAppProvider>
  </React.StrictMode>
);
