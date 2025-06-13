
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  user: any;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
}

const Header = ({ user, onLoginClick, onRegisterClick, onLogout }: HeaderProps) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Toplansın
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Ana Sayfa</a>
          <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Sahalar</a>
          <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Hakkımızda</a>
          <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">İletişim</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      {user.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white" align="end">
                <DropdownMenuItem className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ayarlar</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout} className="flex items-center text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={onLoginClick} className="text-gray-600 hover:text-green-600">
                Giriş Yap
              </Button>
              <Button onClick={onRegisterClick} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                Kayıt Ol
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
