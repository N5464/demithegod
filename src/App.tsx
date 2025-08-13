import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { RouterProvider, Router, Route, RootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { LeadProvider } from './context/LeadContext';
import DemiGod from './pages/DemiGod';
import DemiMind from './pages/DemiMind';
import StrikeHubV2 from './pages/StrikeHubV2';
import Navigation from './components/Navigation';

const RootComponent = () => {
  const routerState = useRouterState();
  const isHomePage = routerState.location.pathname === '/';

  return (
    <LeadProvider>
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        {!isHomePage && <Navigation />}
        <Outlet />
        <Toaster />
      </div>
    </LeadProvider>
  );
};

const rootRoute = new RootRoute({
  component: RootComponent,
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DemiGod,
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

const routeTree = rootRoute.addChildren([indexRoute, demiMindRoute, strikeHubV2Route]);

const router = new Router({ routeTree });

function App() {
  return <RouterProvider router={router} />;
}


export default App;