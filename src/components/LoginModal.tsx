import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onLogin: (loginData: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLogin,
  isLoading
}: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await onLogin({
      email: formData.email,
      password: formData.password
    });
    
    if (result.success) {
      // Reset form on successful login
      setFormData({ email: '', password: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Giriş Yap
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-green-600" />
              <span>E-posta</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Şifreniz"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="focus:ring-2 focus:ring-green-500 pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Giriş Yapılıyor…' : 'Giriş Yap'}
          </Button>
        </form>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">
            Hesabın yok mu?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-green-600 hover:underline font-medium"
              disabled={isLoading}
            >
              Kayıt Ol
            </button>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
