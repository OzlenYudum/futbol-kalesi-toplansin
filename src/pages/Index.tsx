import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users, Shield, Zap, Trophy, Download, X, Smartphone, Apple, Play, ChevronRight, TrendingUp, Search, Calendar, Award, CheckCircle, ArrowRight, Heart, Share2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FieldCard from '@/components/FieldCard';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL, HOMEPAGE_FEATURES, HOMEPAGE_BENEFITS } from '@/constants';

interface IndexProps {
  user: any;
  setUser: (user: any) => void;
}

const Index = ({ user, setUser }: IndexProps) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAppBanner, setShowAppBanner] = useState(true);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Kullanıcı login yaptıysa Fields sayfasına yönlendir
  useEffect(() => {
    if (user) {
      navigate('/fields');
    }
  }, [user, navigate]);

  // Register'dan geliyorsa login modal'ını aç
  useEffect(() => {
    if (location.state?.openLoginModal) {
      setShowLogin(true);
      // State'i temizle
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAppBanner(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Öne çıkan halısahaları backend'den çek
  const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ['halisahalar'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/halisaha/`);
      if (!res.ok) throw new Error('Halı sahalar yüklenemedi');
      return res.json();
    },
  });
  


  // Backend'den gelen veriyi frontend formatına çevir
  const allFields = apiResponse?.data?.map((field: any, index: number) => {
    // Rating'i daha gerçekçi yap
    
    // Review count'u daha gerçekçi yap
    
    return {
      id: field.id,
      name: field.name,
      location: field.location,
      rating: field.rating,
      reviewCount: field.reviewCount,
      pricePerHour: field.pricePerHour,
      image: field.imagesUrl?.[0] || '/field-1.svg', // Backend'den gelen ilk resmi kullan
      amenities: [
        field.surface,
        `${field.maxPlayers} kişi`,
        field.hasParking ? 'Park Yeri' : null,
        field.hasShowers ? 'Duş' : null,
        field.hasCafeteria ? 'Kafeterya' : null,
        field.hasNightLighting ? 'Işıklı' : null,
      ].filter(Boolean),
      premium: field.pricePerHour > 250,
      availability: field.availableSlots ? `${field.availableSlots} slot mevcut` : `${Math.floor(Math.random() * 10) + 1} slot mevcut`,
      features: {
        lighting: field.hasNightLighting,
        parking: field.hasParking,
        wifi: field.hasWifi || false,
        locker: field.hasShowers,
        shoeRental: field.hasShoeRental,
        cafeteria: field.hasCafeteria,
      }
    };
  }) || [];
  
  const featuredFields = allFields.slice(0, 3);

  // Icon mapping for features
  const iconMap = {
    Zap: <Zap className="h-8 w-8" />,
    Shield: <Shield className="h-8 w-8" />,
    Trophy: <Trophy className="h-8 w-8" />,
    Award: <Award className="h-8 w-8" />
  };

  const features = HOMEPAGE_FEATURES.map(feature => ({
    ...feature,
    icon: iconMap[feature.iconName as keyof typeof iconMap]
  }));

  const benefits = HOMEPAGE_BENEFITS;

  const handleNewsletterSubscribe = () => {
    if (!email) {
      toast({
        title: "Hata",
        description: "Lütfen e-posta adresinizi girin.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir e-posta adresi girin.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Başarılı!",
      description: "E-bülten aboneliğiniz başarıyla oluşturuldu. İlk fırsatlardan haberdar olacaksınız!",
    });
    setEmail('');
  };

  const handleFieldClick = (fieldId: string | number) => {
    navigate(`/field/${fieldId}`);
  };

  const handleAppDownload = (platform: 'ios' | 'android') => {
    toast({
      title: "Yakında!",
      description: `${platform === 'ios' ? 'iOS' : 'Android'} uygulamımız çok yakında App Store'da!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50">
      <Header 
        user={user} 
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onLogout={() => setUser(null)}
      />
      
      {/* Enhanced Mobile App Banner */}
      {showAppBanner && (
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse delay-300"></div>
          
          <div className="relative max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 animate-scale-in">
                  <Smartphone className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">📱 Toplansın Mobil Uygulaması</h3>
                  <p className="text-sm opacity-90">Daha hızlı rezervasyon, özel fırsatlar ve kolay saha bulma!</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3">
                  <Button 
                    size="sm" 
                    onClick={() => handleAppDownload('ios')}
                    className="bg-black hover:bg-gray-900 text-white h-12 px-4 rounded-xl font-medium transition-all hover:scale-105 duration-300"
                  >
                    <Apple className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <div className="text-xs opacity-80">Download on the</div>
                      <div className="text-sm font-semibold">App Store</div>
                    </div>
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleAppDownload('android')}
                    className="bg-black hover:bg-gray-900 text-white h-12 px-4 rounded-xl font-medium transition-all hover:scale-105 duration-300"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <div className="text-xs opacity-80">Get it on</div>
                      <div className="text-sm font-semibold">Google Play</div>
                    </div>
                  </Button>
                </div>
                
                <div className="md:hidden flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleAppDownload('ios')}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-xl transition-all hover:scale-105"
                  >
                    <Apple className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleAppDownload('android')}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-xl transition-all hover:scale-105"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setShowAppBanner(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-all hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Hero onGetStarted={() => setShowRegister(true)} />

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Neden <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Toplansın</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Halı saha rezervasyonunu kolaylaştırıyoruz. Kaliteli sahalar, uygun fiyatlar ve hızlı rezervasyon.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg animate-fade-in cursor-pointer" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className={`mx-auto w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:rotate-6`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2 text-gray-900 group-hover:text-green-600 transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Toplansın ile
                <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Avantajları Keşfet
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Türkiye'nin en büyük halı saha rezervasyon platformu ile eşsiz deneyim yaşayın.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 animate-fade-in hover:translate-x-2 transition-transform duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button 
                  size="lg" 
                  onClick={() => setShowRegister(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
                >
                  Hemen Başla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 hover:scale-105">
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 animate-pulse">
                    4.8★
                  </div>
                  <p className="text-gray-600 mb-4">Kullanıcı Memnuniyeti</p>
                  <div className="flex justify-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current animate-fade-in hover:scale-125 transition-transform" style={{ animationDelay: `${star * 100}ms` }} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">4,189+ değerlendirme</p>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl shadow-lg animate-fade-in hover:scale-110 transition-transform duration-300" style={{ animationDelay: '300ms' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-sm">Aktif Saha</div>
                </div>
              </div>
              
              <div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-lg animate-fade-in hover:scale-110 transition-transform duration-300" style={{ animationDelay: '600ms' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm">Rezervasyon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fields Section - Enhanced */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Öne Çıkan <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Halı Sahalar</span>
            </h2>
            <p className="text-xl text-gray-600">
              En popüler ve kaliteli halı sahaları keşfet
            </p>
          </div>
          {isLoading ? (
            <div className="text-center text-lg text-gray-500 py-12">Yükleniyor...</div>
          ) : isError ? (
            <div className="text-center text-lg text-red-500 py-12">Halı sahalar yüklenemedi.</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {featuredFields && featuredFields.length > 0 ? featuredFields.map((field: any, index: number) => (
                <div key={field.id} className="group animate-fade-in cursor-pointer" style={{ animationDelay: `${index * 200}ms` }} onClick={() => handleFieldClick(field.id)}>
                  <FieldCard field={field} />
                </div>
              )) : (
                <div className="col-span-3 text-center text-gray-500 py-12">Hiç halı saha bulunamadı.</div>
              )}
            </div>
          )}
          <div className="text-center animate-fade-in">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/fields')}
              className="border-2 border-green-500 text-green-600 hover:bg-green-50 text-lg px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Tüm Sahaları Görüntüle
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Enhanced */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse delay-300"></div>
        
        <div className="max-w-4xl mx-auto text-center text-white relative z-10 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Özel Fırsatları Kaçırma!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            E-bültenimize abone ol, indirimlerden ve yeni sahalardan ilk sen haberdar ol.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="E-posta adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg transition-all duration-300 focus:scale-105"
            />
            <Button 
              onClick={handleNewsletterSubscribe}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-300"
            >
              Abone Ol
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden animate-fade-in hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse delay-300"></div>
            
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-6">
                Hemen Sahaya Çık!
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Arkadaşlarınla unutulmaz maçlar için en iyi halı sahaları rezerve et. 
                Şimdi kayıt ol, ilk rezervasyonunda %20 indirim kazan!
              </p>
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100 text-xl px-12 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-300"
                onClick={() => setShowRegister(true)}
              >
                Ücretsiz Kayıt Ol
                <ChevronRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Toplansın
              </h3>
              <p className="text-gray-400 mb-6">
                Türkiye'nin en büyük halı saha rezervasyon platformu. 
                Kaliteli sahalar, uygun fiyatlar, kolay rezervasyon.
              </p>
              <div className="flex space-x-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleAppDownload('ios')}
                  className="border-gray-600 text-gray-400 hover:text-white hover:border-white transition-all hover:scale-110"
                >
                  <Apple className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleAppDownload('android')}
                  className="border-gray-600 text-gray-400 hover:text-white hover:border-white transition-all hover:scale-110"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h4 className="font-semibold mb-4 text-lg">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li><button onClick={() => navigate('/fields')} className="hover:text-white transition-colors hover:underline text-left">Sahalar</button></li>
                <li><button onClick={() => navigate('/fields')} className="hover:text-white transition-colors hover:underline text-left">Rezervasyon</button></li>
                <li><button onClick={() => handleAppDownload('ios')} className="hover:text-white transition-colors hover:underline text-left">Mobil Uygulama</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors hover:underline text-left">Saha Ekle</button></li>
              </ul>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h4 className="font-semibold mb-4 text-lg">Destek</h4>
              <ul className="space-y-3 text-gray-400">
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors hover:underline text-left">Yardım Merkezi</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors hover:underline text-left">İletişim</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors hover:underline text-left">SSS</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors hover:underline text-left">Canlı Destek</button></li>
              </ul>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h4 className="font-semibold mb-4 text-lg">Şirket</h4>
              <ul className="space-y-3 text-gray-400">
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors hover:underline text-left">Hakkımızda</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors hover:underline text-left">Kariyer</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors hover:underline text-left">Blog</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors hover:underline text-left">Basın</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 animate-fade-in">
            <p>&copy; 2024 Toplansın. Tüm hakları saklıdır. | 
              <button onClick={() => navigate('/about')} className="hover:text-white transition-colors hover:underline ml-1">Gizlilik Politikası</button> | 
              <button onClick={() => navigate('/about')} className="hover:text-white transition-colors hover:underline ml-1">Kullanım Şartları</button>
            </p>
          </div>
        </div>
      </footer>

      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onLogin={setUser}
      />
      
      <RegisterModal 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
        onRegister={setUser}
      />
    </div>
  );
};

export default Index;
