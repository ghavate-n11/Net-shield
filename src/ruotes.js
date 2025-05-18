import WelcomePage from './pages/WelcomePage';

const routes = [
  { path: '/', element: <WelcomePage /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/capture', element: <CapturePage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/about', element: <AboutPage /> },
];

export default routes;
