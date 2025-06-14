
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, HelpCircle, Star, CheckCircle, Heart, Users } from 'lucide-react';
import Header from '@/components/Header';

const Contact = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.');
    setFormData({ name: '', email: '', subject: '', message: '' });
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
        onLoginClick={() => {}}
        onRegisterClick={() => {}}
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

      {/* Contact Info & Form */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">İletişim Kanalları</h2>
              <div className="space-y-6">
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
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h3>
                <div className="space-y-4">
                  <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-12">
                    <MessageCircle className="mr-3 h-5 w-5" />
                    Canlı Destek Başlat
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-2 border-green-500 text-green-600 hover:bg-green-50 h-12">
                    <HelpCircle className="mr-3 h-5 w-5" />
                    Sıkça Sorulan Sorular
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-2 border-blue-500 text-blue-600 hover:bg-blue-50 h-12">
                    <Phone className="mr-3 h-5 w-5" />
                    Telefon Desteği
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl text-center">Mesaj Gönder</CardTitle>
                  <p className="text-center opacity-90">Size 24 saat içinde dönüş yapacağız</p>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ad Soyad *
                        </label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Adınız ve soyadınız"
                          className="h-12 focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          E-posta *
                        </label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="ornek@email.com"
                          className="h-12 focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Konu *
                      </label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Mesajınızın konusu"
                        className="h-12 focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mesaj *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Mesajınızı detaylı olarak yazın..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-12 text-lg font-semibold">
                      <Send className="mr-2 h-5 w-5" />
                      Mesaj Gönder
                    </Button>
                  </form>
                </CardContent>
              </Card>
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
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 font-semibold">
              <Phone className="mr-2 h-5 w-5" />
              Bizi Arayın
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
