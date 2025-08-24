import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import LoginForm from '@/components/auth/LoginForm';
import Home from '@/pages/Home';
import Announcements from '@/pages/Announcements';
import Events from '@/pages/Events';
import Marketplace from '@/pages/Marketplace';
import Contacts from '@/pages/Contacts';
import Admin from '@/pages/Admin';

const queryClient = new QueryClient();

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (currentPage === 'login') {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <LoginForm onLoginSuccess={() => setCurrentPage('home')} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onPageChange={setCurrentPage} />;
      case 'announcements':
        return <Announcements />;
      case 'events':
        return <Events />;
      case 'marketplace':
        return <Marketplace />;
      case 'contacts':
        return <Contacts />;
      case 'admin':
        return <Admin />;
      default:
        return <Home onPageChange={setCurrentPage} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-gray-50">
          <Header currentPage={currentPage} onPageChange={setCurrentPage} />
          <main>
            {renderPage()}
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;