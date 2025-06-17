import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, MessageCircle, HelpCircle, Star, CheckCircle, Heart, Users, Send, Map } from 'lucide-react';
import Header from '@/components/Header';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface ContactProps {
  user: any;
  setUser: (user: any) => void;
}

const Contact = ({ user, setUser }: ContactProps) => {
  const { toast } = useToast();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: 'Lütfen tüm alanları doldurun', variant: 'destructive' });
      return;
    }
    toast({ title: 'Mesajınız gönderildi!', description: 'En kısa sürede sizinle iletişime geçeceğiz.' });
    setFormData({ name: '', email: '', message: '' });
  };

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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">İletişim Kanalları</h2>
            <p className="text-xl text-gray-600">Size ulaşmanın en kolay yolları</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 justify-items-center mb-12">
            {contactInfo.map((info, index) => (
              <Card key={index} className="w-full max-w-lg border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-3xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
                  <div className={`w-20 h-20 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center text-white text-3xl shadow-inner`}>
                    {info.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 text-base max-w-xs">
                    {info.description}
                  </p>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-800 font-semibold">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-transparent to-emerald-50" />
        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="rounded-3xl overflow-hidden shadow-xl border border-green-100">
            <iframe
              title="Toplansın Konum"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.1963418194416!2d29.101019376336063!3d41.01525051997202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caad4b9f3845ab%3A0x52b0fe8c305a05!2sAta%C5%9Fehir%2C%20%C4%B0stanbul!5e0!3m2!1str!2str!4v1710000000000!5m2!1str!2str"
              loading="lazy"
              className="w-full h-full min-h-[350px] grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>

          {/* Form */}
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/80">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
                <Send className="h-6 w-6" /> İletişim Formu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Adınız"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <Input
                    placeholder="E-posta"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <Textarea
                  placeholder="Mesajınız"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 text-lg font-semibold shadow-lg">
                  Gönder
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section (Accordion) */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sıkça Sorulan <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Sorular</span>
            </h2>
            <p className="text-xl text-gray-600">En çok merak edilen sorular ve detaylı cevapları</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gray-50 rounded-2xl shadow-lg border border-transparent hover:border-emerald-200 transition-colors"
              >
                <AccordionTrigger className="px-6 py-4 flex items-center gap-3 text-lg font-semibold text-gray-800">
                  <HelpCircle className="h-5 w-5 text-emerald-600" />
                  <span>{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0 text-gray-700 leading-relaxed bg-white">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
