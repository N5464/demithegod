import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { RouterProvider, Router, Route, RootRoute, Outlet } from '@tanstack/react-router';
import { LeadProvider } from './context/LeadContext';
import DemiGod from './pages/DemiGod';
import DemiOps from './pages/DemiOps';
import DemiMind from './pages/DemiMind';
import StrikeHubV2 from './pages/StrikeHubV2';
import Navigation from './components/Navigation';
import GhostGate from './components/GhostGate';

const rootRoute = new RootRoute({
  component: () => (
    <LeadProvider>
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <Navigation />
        <Outlet />
        <Toaster />
      </div>
    </LeadProvider>
  ),
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DemiGod,
});

const demiOpsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/ops',
  component: DemiOps,
});

const demiMindRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/DemiMind',
  component: DemiMind,
});

const strikeHubV2Route = new Route({
  getParentRoute: () => rootRoute,
  path: '/strikehub',
  component: StrikeHubV2,
});

const routeTree = rootRoute.addChildren([indexRoute, demiOpsRoute, demiMindRoute, strikeHubV2Route]);
const router = new Router({ routeTree });

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const authStatus = localStorage.getItem('demigod_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    localStorage.setItem('demigod_authenticated', 'true');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <GhostGate onAuthenticated={handleAuthentication} />;
  }

  return <RouterProvider router={router} />;
}

export default App;