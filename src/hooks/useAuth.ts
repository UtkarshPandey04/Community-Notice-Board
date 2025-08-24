import { useState, useEffect } from 'react';
import { User } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('communityUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // Simple mock authentication
    const mockUsers = [
      { id: '1', name: 'Utkarsh Pandey', email: 'utkarshpandey.up.2004@gmail.com', role: 'admin' as const, password: 'uttu123' },
      { id: '2', name: 'Sujal Kumar', email: 'sujalkumar@gmail.com', role: 'user' as const, password: 'suji123' }
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        isAuthenticated: true
      };
      setUser(userWithoutPassword);
      localStorage.setItem('communityUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('communityUser');
  };

  return { user, login, logout, loading };
};