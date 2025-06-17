import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Phone, Mail, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegister: (user: any) => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegister
}: RegisterModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, loading } = useAuth(onRegister);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Hata",
        description: "Şifreler eşleşmiyor!",
        variant: "destructive",
      });
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });
      onClose();
    } catch (error) {
      // Error handling done in useAuth hook
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Kayıt Ol
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center space-x-2">
              <User className="h-4 w-4 text-green-600" />
              <span>Ad Soyad</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Adınız ve soyadınız"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="focus:ring-2 focus:ring-green-500"
            />
          </div>

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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-green-600" />
              <span>Telefon Numarası</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0555 123 45 67"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              className="focus:ring-2 focus:ring-green-500"
            />
          </div>



          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="En az 6 karakter"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                minLength={6}
                className="focus:ring-2 focus:ring-green-500 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Şifrenizi tekrar girin"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                className="focus:ring-2 focus:ring-green-500 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center">
            <input type="checkbox" required className="rounded border-gray-300" />
            <span className="ml-2 text-sm text-gray-600">
              <a href="#" className="text-green-600 hover:underline">Kullanım Şartları</a>'nı ve{' '}
              <a href="#" className="text-green-600 hover:underline">Gizlilik Politikası</a>'nı kabul ediyorum
            </span>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            disabled={loading}
          >
            {loading ? 'Kayıt Oluşturuluyor…' : 'Kayıt Ol'}
          </Button>
        </form>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">
            Zaten hesabın var mı?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-green-600 hover:underline font-medium"
            >
              Giriş Yap
            </button>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
