import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Shield } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'events', label: 'Events' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'contacts', label: 'Contacts' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin' });
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => onPageChange('home')}>
              Community Board
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm">
                  {user.role === 'admin' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  <span>{user.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => onPageChange('login')}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}