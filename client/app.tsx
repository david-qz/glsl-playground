import React from 'react';
import { createRoot } from 'react-dom/client';
import './reset.css';
import './global.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import EditorView from './components/views/editor-view/editor-view';

const container = document.getElementById('app') || document.createElement('div')
container.id = 'app'
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={ <EditorView /> } />
      </Routes>
    </Router>
  </React.StrictMode>
);
