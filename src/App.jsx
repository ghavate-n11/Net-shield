import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MenuBar from './components/MenuBar';  // Keep the import

import WelcomePage from './pages/WelcomePage';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import Logs from './pages/Logs';
import CapturePage from './pages/CapturePage';
import AboutPage from './pages/AboutPage';

const Layout = () => {
  const location = useLocation();
  const showMenuBar = location.pathname === '/dashboard';

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
