import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, MessageCircle, HelpCircle, Star, CheckCircle, Heart, Users } from 'lucide-react';
import Header from '@/components/Header';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import { useToast } from "@/hooks/use-toast";

interface ContactProps {
  user: any;
  setUser: (user: any) => void;
}

const Contact = ({ user, setUser }: ContactProps) => {
  const { toast } = useToast();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "E-posta Desteği",
      details: ["info@toplansin.com", "destek@toplansin.com"],
      description: "7/24 e-posta desteği",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Canlı Destek",
      details: ["Anında yanıt", "Profesyonel ekip"],
      description: "Pazartesi - Pazar: 08:00 - 24:00",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telefon Desteği",
      details: ["+90 (212) 123 45 67", "Ücretsiz arama"],
      description: "Pazartesi - Cuma: 09:00 - 18:00",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const features = [
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Hızlı Yanıt",
      description: "Ortalama 2 dakikada yanıt alın"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Güler Yüzlü Ekip",
      description: "Samimi ve profesyonel destek"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Deneyimli Ekip",
      description: "Uzman müşteri temsilcileri"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Yüksek Memnuniyet",
      description: "4.9/5 müşteri memnuniyeti"
    }
  ];

  const faqItems = [
    {
      question: "Rezervasyon nasıl yapılır?",
      answer: "Saha seçtikten sonra müsait saatleri görebilir ve tek tıkla rezervasyon yapabilirsiniz. Ödeme işlemini tamamladıktan sonra onay mesajı alırsınız."
    },
    {
      question: "Ödeme güvenli mi?",
      answer: "Evet, 256-bit SSL şifrelemesi ve PCI DSS sertifikalı güvenli ödeme gateway'leri kullanıyoruz. Kredi kartı bilgileriniz güvenle şifrelenir."
    },
    {
      question: "İptal politikası nedir?",
      answer: "Rezervasyonunuzu en az 2 saat önceden ücretsiz iptal edebilirsiniz. İptal durumunda ücret iadeniz 1-3 iş günü içinde hesabınıza geçer."
    },
    {
      question: "Saha ekleyebilir miyim?",
      answer: "Evet, saha sahibiyseniz 'Saha Ekle' bölümünden başvuruda bulunabilirsiniz. Ekibimiz 24 saat içinde sizinle iletişime geçer."
    },
    {
      question: "Mobil uygulama var mı?",
      answer: "Evet, iOS ve Android platformlarında ücretsiz mobil uygulamamız mevcuttur. App Store ve Google Play'den indirebilirsiniz."
    },
    {
      question: "Grup rezervasyonu yapılır mı?",
      answer: "Evet, 10 saha ve üzeri rezervasyonlar için özel indirimler sunuyoruz. Kurumsal rezervasyonlar için bizimle iletişime geçin."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header 
        user={user} 
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onLogout={() => setUser(null)}
      />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6">
            Size Nasıl Yardımcı Olabiliriz?
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya geri bildirimleriniz için 7/24 hizmetinizdeyiz
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">İletişim Kanalları</h2>
            <p className="text-xl text-gray-600">Size ulaşmanın en kolay yolları</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {contactInfo.map((info, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${info.gradient} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{info.title}</h3>
                      <p className="text-gray-600 mb-3">{info.description}</p>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-800 font-medium">{detail}</p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Hızlı İşlemler</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-14 flex-col">
                <MessageCircle className="h-6 w-6 mb-1" />
                <span className="text-sm">Canlı Destek</span>
              </Button>
              <Button variant="outline" className="justify-center border-2 border-green-500 text-green-600 hover:bg-green-50 h-14 flex-col">
                <HelpCircle className="h-6 w-6 mb-1" />
                <span className="text-sm">S.S.S</span>
              </Button>
              <Button variant="outline" className="justify-center border-2 border-blue-500 text-blue-600 hover:bg-blue-50 h-14 flex-col">
                <Phone className="h-6 w-6 mb-1" />
                <span className="text-sm">Telefon</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sıkça Sorulan <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Sorular</span>
            </h2>
            <p className="text-xl text-gray-600">En çok merak edilen sorular ve detaylı cevapları</p>
          </div>
          
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
                <CardContent className="p-8">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                    <HelpCircle className="mr-3 h-6 w-6 text-green-600" />
                    {item.question}
                  </h3>
                  <p className="text-gray-700 ml-9 leading-relaxed">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Sorunuz burada yok mu?</p>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3">
              Canlı Destek Başlat
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-500 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Hâlâ Yardıma İhtiyacınız Var mı?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Ekibimiz size yardımcı olmaktan mutluluk duyar
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 font-semibold">
              <MessageCircle className="mr-2 h-5 w-5" />
              Canlı Destek
            </Button>
            <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-white hover:text-green-600 px-8 py-3 font-semibold">
              <Phone className="mr-2 h-5 w-5" />
              Bizi Arayın
            </Button>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onLogin={setUser}
      />

      {/* Register Modal */}
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

export default Contact;
