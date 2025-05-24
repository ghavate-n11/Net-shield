import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
} from 'react-router-dom';

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

const Layout = () => {
  const location = useLocation();

  // Show MenuBar only on dashboard and network-scanner routes
  const showMenuBar =
    location.pathname === '/dashboard' || location.pathname === '/network-scanner';

  return (
    <>
      <Header />
      {showMenuBar && <MenuBar />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="alerts" element={<LiveAlerts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logs" element={<Logs />} />
          <Route path="capture" element={<CapturePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="network-scanner" element={<NetworkScanner />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
