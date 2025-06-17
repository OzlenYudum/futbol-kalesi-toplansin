import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/constants';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  showLoginModal: boolean;
  showRegisterModal: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    showLoginModal: false,
    showRegisterModal: false,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Validate token with backend if needed
      // For now, we'll just check if token exists
      console.log('Token found, user might be logged in');
    }
  }, []);

  // Modal Controls
  const openLoginModal = () => {
    setAuthState(prev => ({ 
      ...prev, 
      showLoginModal: true, 
      showRegisterModal: false 
    }));
  };

  const openRegisterModal = () => {
    setAuthState(prev => ({ 
      ...prev, 
      showRegisterModal: true, 
      showLoginModal: false 
    }));
  };

  const closeModals = () => {
    setAuthState(prev => ({ 
      ...prev, 
      showLoginModal: false, 
      showRegisterModal: false 
    }));
  };

  const switchToRegister = () => {
    setAuthState(prev => ({ 
      ...prev, 
      showLoginModal: false, 
      showRegisterModal: true 
    }));
  };

  const switchToLogin = () => {
    setAuthState(prev => ({ 
      ...prev, 
      showRegisterModal: false, 
      showLoginModal: true 
    }));
  };

  // Login Function
  const login = async (loginData: LoginData) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Giriş işlemi başarısız');
      }

      const response = await res.json();
      console.log('Login response:', response);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || "Giriş işlemi başarısız");
      }
      
      const data = response.data;
      let user, token;
      
      // Backend response formatına göre user ve token'ı ayır
      if (data.user && data.token) {
        user = data.user;
        token = data.token;
      } else if (data.token) {
        const { token: extractedToken, ...userData } = data;
        user = userData;
        token = extractedToken;
      } else {
        throw new Error("Kullanıcı bilgileri alınamadı. Lütfen bilgilerinizi kontrol edin.");
      }
      
      localStorage.setItem('token', token);
      
      setAuthState(prev => ({ 
        ...prev, 
        user, 
        isLoading: false,
        showLoginModal: false 
      }));
      
      toast({
        title: "Giriş Başarılı!",
        description: `Hoş geldiniz, ${user.name}!`,
        duration: 3000,
      });

      navigate('/profile');
      return { success: true };
      
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Giriş Başarısız",
        description: error.message,
        variant: "destructive",
      });
      
      return { success: false, error: error.message };
    }
  };

  // Register Function
  const register = async (registerData: RegisterData) => {
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Hata",
        description: "Şifreler eşleşmiyor!",
        variant: "destructive",
      });
      return { success: false, error: "Şifreler eşleşmiyor!" };
    }

    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password,
          role: registerData.role || 'USER'
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Kayıt işlemi başarısız');
      }

      const { user, token } = await res.json();
      localStorage.setItem('token', token);
      
      setAuthState(prev => ({ 
        ...prev, 
        user, 
        isLoading: false,
        showRegisterModal: false 
      }));
      
      toast({
        title: "Kayıt Başarılı!",
        description: `Kayıt işleminiz başarılı. Hoş geldiniz ${user.name}!`,
        duration: 3000,
      });
      
      navigate('/profile');
      return { success: true };
      
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Kayıt Başarısız",
        description: error.message,
        variant: "destructive",
      });
      
      return { success: false, error: error.message };
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    setAuthState(prev => ({ 
      ...prev, 
      user: null,
      showLoginModal: false,
      showRegisterModal: false 
    }));
    
    toast({
      title: "Çıkış Yapıldı",
      description: "Başarıyla çıkış yaptınız.",
    });
    
    navigate('/');
  };

  // Set User (for external updates)
  const setUser = (user: User | null) => {
    setAuthState(prev => ({ ...prev, user }));
  };

  return {
    // State
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: !!authState.user,
    
    // Modal State
    showLoginModal: authState.showLoginModal,
    showRegisterModal: authState.showRegisterModal,
    
    // Modal Controls
    openLoginModal,
    openRegisterModal,
    closeModals,
    switchToLogin,
    switchToRegister,
    
    // Auth Actions
    login,
    register,
    logout,
    setUser,
  };
} 