import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HeartBubbles from './components/HeartBubbles';
import Dashboard from './pages/Dashboard';
import Surprise from './pages/Surprise';
import CutiePie from './pages/CutiePie';
import PrivatePie from './pages/PrivatePie';

function Layout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        {/* Atmospheric orbs */}
        <div className="page-bg-orb orb-1" />
        <div className="page-bg-orb orb-2" />
        <div className="page-bg-orb orb-3" />
        {/* Floating hearts background */}
        <HeartBubbles />
        <Header />
        <div className="page-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/surprise"  element={<Layout><Surprise /></Layout>} />
        <Route path="/cutie-pie" element={<Layout><CutiePie /></Layout>} />
        <Route path="/private-pie" element={<Layout><PrivatePie /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
