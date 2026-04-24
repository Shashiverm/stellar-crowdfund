import React, { Suspense, useEffect } from 'react';
import { createBrowserRouter, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { useWallet } from '@/hooks/useWallet';

const Home = React.lazy(() => import('@/pages/Home'));
const Donate = React.lazy(() => import('@/pages/Donate'));
const Activity = React.lazy(() => import('@/pages/Activity'));
const About = React.lazy(() => import('@/pages/About'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

function AppShell() {
  const location = useLocation();
  const wallet = useWallet();

  useEffect(() => {
    const title = location.pathname === '/' ? 'StellarFund' : `StellarFund • ${location.pathname.slice(1) || 'home'}`;
    document.title = title;
  }, [location.pathname]);

  return (
    <div className="app-shell min-h-screen text-[var(--text-primary)]">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar wallet={wallet} />
      <Sidebar wallet={wallet} />
      <main id="main-content" className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -36 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            <Suspense fallback={<div className="rounded-3xl border border-white/10 p-10 text-center text-[var(--text-secondary)]">Loading mission telemetry...</div>}>
              <Outlet context={wallet} />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'donate', element: <Donate /> },
      { path: 'activity', element: <Activity /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default AppShell;