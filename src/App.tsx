import React from 'react';
import { Toaster } from 'react-hot-toast';
import { RouterProvider, Router, Route, RootRoute, Outlet } from '@tanstack/react-router';
import { LeadProvider } from './context/LeadContext';
import DemiGod from './pages/DemiGod';
import DemiOps from './pages/DemiOps';
import DemiMind from './pages/DemiMind';
import DemiScope from './pages/DemiScope';
import Navigation from './components/Navigation';

const rootRoute = new RootRoute({
  component: () => (
    <LeadProvider>
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
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

const demiScopeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/DemiScope',
  component: DemiScope,
});

const routeTree = rootRoute.addChildren([indexRoute, demiOpsRoute, demiMindRoute, demiScopeRoute]);
const router = new Router({ routeTree });

function App() {
  return <RouterProvider router={router} />;
}

export default App;