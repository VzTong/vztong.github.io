// Application entry point
// Import i18n BEFORE rendering to ensure translations are ready
import './i18n'
import './assets/index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// In React 19, StrictMode double-invokes effects which causes DOM-manipulation
// libraries like react-pageflip (StPageFlip) to crash on initial remount.
// Rendering App directly ensures stable DOM lifecycle for 3D canvas/flipbook.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
