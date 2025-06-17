import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';
import { API_BASE_URL } from '@/constants';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

interface UseAuthReturn {
  login: (data: LoginData) => Promise<AuthUser>;
  register: (data: RegisterData) => Promise<AuthUser>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = (onAuthSuccess?: (user: AuthUser) => void): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Token'dan authentication durumunu kontrol et
  const isAuthenticated = !!localStorage.getItem('token');

  const login = async (data: LoginData): Promise<AuthUser> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Giriş işlemi başarısız');
      }

      const response = await res.json();
      
      if (!response.success || !response.data) {
        throw new Error(response.message || "Giriş işlemi başarısız");
      }
      
      const responseData = response.data;
      let user: AuthUser, token: string;
      
      // Backend response formatına göre user ve token'ı ayır
      if (responseData.user && responseData.token) {
        // Format 1: { data: { user: {...}, token: "..." } }
        user = responseData.user;
        token = responseData.token;
      } else if (responseData.token) {
        // Format 2: { data: { id, name, email, ..., token: "..." } }
        const { token: extractedToken, ...userData } = responseData;
        user = userData;
        token = extractedToken;
      } else {
        throw new Error("Kullanıcı bilgileri alınamadı. Lütfen bilgilerinizi kontrol edin.");
      }
      
      localStorage.setItem('token', token);
      
      // Başarılı giriş bildirimi
      toast({
        title: "Giriş Başarılı!",
        description: `Hoş geldiniz, ${user.name}!`,
        duration: 3000,
      });

      // Callback ile parent component'e bildir
      onAuthSuccess?.(user);

      // Profil sayfasına yönlendirme
      navigate('/profile');

      return user;
    } catch (error: any) {
      toast({
        title: "Giriş Başarısız",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthUser> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          role: data.role || 'USER'
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Kayıt işlemi başarısız');
      }

      const response = await res.json();
      const user = response.user || response.data?.user;
      const token = response.token || response.data?.token;

      if (!user || !token) {
        throw new Error('Kayıt işlemi başarısız. Lütfen tekrar deneyin.');
      }

      localStorage.setItem('token', token);
      
      // Kayıt başarılı mesajı göster
      toast({
        title: "Kayıt Başarılı!",
        description: "Kayıt işleminiz başarılı. Hoş geldiniz!",
        duration: 3000,
      });

      // Callback ile parent component'e bildir
      onAuthSuccess?.(user);

      // Profil sayfasına yönlendirme
      navigate('/profile');

      return user;
    } catch (error: any) {
      toast({
        title: "Kayıt Başarısız",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    toast({
      title: "Çıkış Yapıldı",
      description: "Başarıyla çıkış yaptınız.",
      duration: 2000,
    });
    navigate('/');
  };

  return {
    login,
    register,
    logout,
    loading,
    isAuthenticated
  };
}; 