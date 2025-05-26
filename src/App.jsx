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
import FirewallRules from './pages/FirewallRules';
import BluetoothStats from './components/BluetoothStats';
import Wireless80211Stats from './components/Wireless80211Stats';
import VoipCalls from "./pages/VoipCalls";
import SipFlows from "./pages/SipFlows";
import RtpStreams from "./pages/RtpStreams";

const Layout = () => {
  const location = useLocation();

  // ✅ Updated showMenuBar logic:
  // It should be visible on most application pages where its functionality is needed.
  // Assuming it should NOT be shown on the Welcome page or About page, for example.
  const showMenuBar =
    location.pathname !== '/' && // Not on the welcome page
    location.pathname !== '/about'; // Not on the about page (as 'About' is also in MenuBar)

  return (
    <>
      <Header />
      {showMenuBar && <MenuBar />} {/* Render MenuBar only if showMenuBar is true */}
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
        {/* ✅ Corrected Telephony routes to match MenuBar.js navigation */}
        <Route path="/voip-calls" element={<VoipCalls />} />
        <Route path="/sip-flows" element={<SipFlows />} />
        <Route path="/rtp-streams" element={<RtpStreams />} />
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