import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './App';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 4000,
      refetchInterval: 5000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function createStarField(count = 200) {
  const maxWidth = window.innerWidth || 1440;
  const maxHeight = window.innerHeight || 900;
  return Array.from({ length: count }, () => {
    const x = Math.round(Math.random() * maxWidth);
    const y = Math.round(Math.random() * maxHeight);
    const blur = Math.random() > 0.9 ? 1 : 0;
    const alpha = (0.2 + Math.random() * 0.8).toFixed(2);
    return `${x}px ${y}px 0 ${blur}px rgba(232, 244, 253, ${alpha})`;
  }).join(', ');
}

if (typeof document !== 'undefined') {
  document.documentElement.style.setProperty('--star-field', createStarField());
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4500,
          style: {
            background: 'rgba(7, 13, 20, 0.94)',
            color: '#e8f4fd',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            boxShadow: '0 0 24px rgba(0, 229, 255, 0.12)',
            fontFamily: '"IBM Plex Mono", monospace',
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>,
);