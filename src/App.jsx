import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import MenuBar from './components/MenuBar';

import WelcomePage from './pages/WelcomePage';
import Dashboard from './pages/Dashboard';
import LiveAlerts from './pages/LiveAlerts';
import Settings from './pages/Settings';
import Logs from './pages/Logs';
import CapturePage from './pages/CapturePage';
import AboutPage from './pages/AboutPage';
import NetworkScanner from './components/NetworkScanner';
import FirewallRules from './pages/FirewallRules'; // ✅ Import the new page
import BluetoothStats from './components/BluetoothStats';
import Wireless80211Stats from './components/Wireless80211Stats';

const Layout = () => {
  const location = useLocation();

  // ✅ Show MenuBar on these pages, including firewall-rules
  const showMenuBar = 
    location.pathname === '/dashboard' ||
    location.pathname === '/network-scanner' ||
    location.pathname === '/firewall-rules';

  return (
    <>
      <Header />
      {showMenuBar && <MenuBar />}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts" element={<LiveAlerts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/capture" element={<CapturePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/network-scanner" element={<NetworkScanner />} />
         <Route path="/bluetooth-stats" element={<BluetoothStats />} />
        <Route path="/wireless-80211-stats" element={<Wireless80211Stats />} />
        <Route path="/firewall-rules" element={<FirewallRules />} /> {/* ✅ New route */}
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
