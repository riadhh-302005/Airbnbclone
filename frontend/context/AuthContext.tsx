'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../lib/api';

export const DEMO_GUEST: User = {
  id: 'usr_guest_1',
  name: 'Ranjot',
  email: 'ranjot@example.com',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  role: 'guest',
};

export const DEMO_HOST: User = {
  id: 'usr_host_1',
  name: 'Ria',
  email: 'ria@example.com',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  role: 'host',
};

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AuthContextType {
  user: User;
  activeRole: 'guest' | 'host';
  switchRole: (role: 'guest' | 'host') => void;
  favoritesMap: Record<string, boolean>;
  toggleFavorite: (listingId: string) => Promise<void>;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<'guest' | 'host'>('guest');
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const savedRole = localStorage.getItem('airbnb_demo_role') as 'guest' | 'host';
    if (savedRole) {
      setActiveRole(savedRole);
    }
  }, []);

  const user = activeRole === 'guest' ? DEMO_GUEST : DEMO_HOST;

  const switchRole = (role: 'guest' | 'host') => {
    setActiveRole(role);
    localStorage.setItem('airbnb_demo_role', role);
    showToast(`Switched to Demo ${role === 'guest' ? 'Guest (Ranjot)' : 'Host (Ria)'}`, 'info');
  };

  // Load initial favorites for guest user
  useEffect(() => {
    async function loadFavorites() {
      try {
        const favs = await api.getFavorites(user.id);
        const map: Record<string, boolean> = {};
        favs.forEach((f) => {
          map[f.listing_id] = true;
        });
        setFavoritesMap(map);
      } catch {
        // Silent catch if backend loading fails
      }
    }
    loadFavorites();
  }, [user.id]);

  const toggleFavorite = async (listingId: string) => {
    const isFav = !!favoritesMap[listingId];
    // Optimistic UI update
    setFavoritesMap((prev) => ({ ...prev, [listingId]: !isFav }));

    try {
      if (isFav) {
        await api.removeFavorite(listingId, user.id);
        showToast('Removed from wishlist', 'info');
      } else {
        await api.addFavorite(listingId, user.id);
        showToast('Saved to wishlist', 'success');
      }
    } catch (err: any) {
      // Revert optimistic update on error
      setFavoritesMap((prev) => ({ ...prev, [listingId]: isFav }));
      showToast(err.message || 'Failed to update wishlist', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        switchRole,
        favoritesMap,
        toggleFavorite,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
