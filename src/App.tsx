import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Settings from './pages/Settings';

export const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* Dashboard index routing */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Core modules */}
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/settings" element={<Settings />} />

        {/* Dynamic Catch-All Redirect to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
