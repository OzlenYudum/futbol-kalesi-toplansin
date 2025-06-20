import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { User, Settings, LogOut, Menu, Home, MapPin, Info, MessageCircle, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  user: any;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
}

const Header = ({ user, onLoginClick, onRegisterClick, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Navigation items - login durumuna göre farklı
  const navigationItems = user ? [
    { path: '/fields', label: 'Sahalar', icon: MapPin },
    { path: '/about', label: 'Hakkımızda', icon: Info },
    { path: '/contact', label: 'İletişim', icon: MessageCircle }
  ] : [
    { path: '/', label: 'Ana Sayfa', icon: Home },
    { path: '/fields', label: 'Sahalar', icon: MapPin },
    { path: '/about', label: 'Hakkımızda', icon: Info },
    { path: '/contact', label: 'İletişim', icon: MessageCircle }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('reviews-cache');
    onLogout();
    logout();
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button onClick={() => handleNavigation(user ? '/fields' : '/')} className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Toplansın
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0 group">
                    <Avatar className="h-11 w-11 transition-transform duration-300 group-hover:scale-110">
                      <AvatarImage src={user.avatar} alt={user.name} className="rounded-full object-cover" />
                      <AvatarFallback className="rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-semibold text-lg">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-emerald-500 transition-all duration-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 bg-white/95 backdrop-blur-lg border-gray-200 shadow-2xl rounded-xl z-50 mt-2" align="end">
                  <div className="px-4 py-3 border-b border-gray-200/80">
                    <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  <DropdownMenuItem 
                    className="flex items-center gap-3 cursor-pointer p-3 text-sm text-gray-700 hover:bg-green-50/80 hover:text-green-700 transition-colors"
                    onClick={() => handleNavigation('/profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>

                  {user.role === 'OWNER' && (
                    <DropdownMenuItem 
                      className="flex items-center gap-3 cursor-pointer p-3 text-sm text-gray-700 hover:bg-green-50/80 hover:text-green-700 transition-colors"
                      onClick={() => handleNavigation('/my-fields')}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>Sahalarım</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem 
                    className="flex items-center gap-3 cursor-pointer p-3 text-sm text-gray-700 hover:bg-green-50/80 hover:text-green-700 transition-colors"
                    onClick={() => handleNavigation('/settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Ayarlar</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 cursor-pointer p-3 text-sm text-red-500 hover:bg-red-50/80 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Button 
                  onClick={onLoginClick}
                  variant="outline"
                  className="hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  Giriş Yap
                </Button>
                <Button 
                  onClick={onRegisterClick}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  Kayıt Ol
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex-1 py-4">
                    <nav className="space-y-2">
                      {navigationItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => handleNavigation(item.path)}
                          className={`flex items-center space-x-2 w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive(item.path)
                              ? 'text-green-600 bg-green-50'
                              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  {!user && (
                    <div className="p-4 border-t space-y-3">
                      <Button 
                        onClick={() => {
                          onLoginClick();
                          setIsMobileMenuOpen(false);
                        }}
                        variant="outline" 
                        className="w-full"
                      >
                        Giriş Yap
                      </Button>
                      <Button 
                        onClick={() => {
                          onRegisterClick();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        Kayıt Ol
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
