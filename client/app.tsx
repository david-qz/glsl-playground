import React from 'react';
import { createRoot } from 'react-dom/client';
import './reset.css';
import './global.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Editor from './components/editor/editor';
import AuthForm from './components/auth-form/auth-form';
import HeaderLayout from './components/header-layout/header-layout';
import { AuthContextProvider } from './hooks/auth-context';

const container = document.getElementById('app') || document.createElement('div');
container.id = 'app';
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Editor />} />
          <Route element={<HeaderLayout />} >
            <Route path="/auth/log-in" element={<AuthForm method='log-in' />} />
            <Route path="/auth/sign-up" element={<AuthForm method='sign-up' />} />
          </Route>
          <Route path='*' element={'not found'} />
        </Routes>
      </Router>
    </AuthContextProvider>
  </React.StrictMode>
);
