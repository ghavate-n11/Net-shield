// Layout.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

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
import FirewallRules from './pages/FirewallRules';
import BluetoothStats from './components/BluetoothStats';
import Wireless80211Stats from './components/Wireless80211Stats';
import VoipCalls from './pages/VoipCalls';
import SipFlows from './pages/SipFlows';
import RtpStreams from './pages/RtpStreams';
import Summary from './pages/Summary';
import ProtocolHierarchy from './pages/ProtocolHierarchy';
import Endpoints from './pages/Endpoints';
import Conversations from './pages/Conversations';

const Layout = () => {
  const location = useLocation();
  const showMenuBar = location.pathname !== '/' && location.pathname !== '/about';

  return (
    <>
      <Header />
      {showMenuBar && <MenuBar />}
      <main style={{ minHeight: '80vh' }}>
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
          <Route path="/firewall-rules" element={<FirewallRules />} />
          <Route path="/voip-calls" element={<VoipCalls />} />
          <Route path="/sip-flows" element={<SipFlows />} />
          <Route path="/rtp-streams" element={<RtpStreams />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/protocol-hierarchy" element={<ProtocolHierarchy />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/endpoints" element={<Endpoints />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
