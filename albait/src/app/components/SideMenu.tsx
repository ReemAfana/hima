import React from 'react';
import { X, Home, Search, User, Building2, MessageSquare, FileText, LogOut, UserPlus } from 'lucide-react';
import { Button } from './ui/button';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  userRole: 'tenant' | 'host' | null;
}

export function SideMenu({ isOpen, onClose, onNavigate, isLoggedIn, userRole }: SideMenuProps) {
  const handleNavigation = (page: string) => {
    onNavigate(page);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-[#8DA87A] to-[#A5B88A] z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-white" />
              <h2 className="text-white">Beit Gaza</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => handleNavigation('login')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Login / Sign Up</span>
                </button>

                <button
                  onClick={() => handleNavigation('become-host')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Become a Host</span>
                </button>
              </>
            )}

            {isLoggedIn && userRole === 'host' && (
              <button
                onClick={() => handleNavigation('host-dashboard')}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <Building2 className="w-5 h-5" />
                <span>Host Dashboard</span>
              </button>
            )}

            <div className="border-t border-white/20 my-4" />

            <button
              onClick={() => handleNavigation('home')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavigation('search')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
              <span>Latest Listings</span>
            </button>

            {isLoggedIn && (
              <button
                onClick={() => handleNavigation('messages')}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Messages</span>
              </button>
            )}

            <button
              onClick={() => handleNavigation('policies')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span>Policies</span>
            </button>

            {isLoggedIn && (
              <button
                onClick={() => handleNavigation('logout')}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            )}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-white">
              <p className="text-sm">Need help?</p>
              <p className="text-sm opacity-80">Contact us for support</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}