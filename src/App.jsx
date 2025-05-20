import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import MenuBar from './components/MenuBar';

import WelcomePage from './pages/WelcomePage';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import Logs from './pages/Logs';
import CapturePage from './pages/CapturePage';
import AboutPage from './pages/AboutPage';
import NetworkScanner from './components/NetworkScanner';

const Layout = () => {
  const location = useLocation();

  // Fix: The route path should match exactly "/network-scanner" (not "networkscanner")
  const showMenuBar = location.pathname === '/dashboard' || location.pathname === '/network-scanner';

  return (
    <>
      <Header />
      {showMenuBar && <MenuBar />}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/capture" element={<CapturePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/network-scanner" element={<NetworkScanner />} />
      </Routes>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
