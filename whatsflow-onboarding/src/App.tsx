import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FormOnboarding from './pages/FormOnboarding';
import ChatOnboarding from './pages/ChatOnboarding';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding">
          <Route index element={<Navigate to="/onboarding/form" replace />} />
          <Route path="form" element={<FormOnboarding />} />
          <Route path="chat" element={<ChatOnboarding />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App; 