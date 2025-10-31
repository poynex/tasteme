# Yakın Kampanyalar - Near Deals (Web)

Bu proje, kullanıcı yakındaki anlaşmalı işletmelerin (kafe, kahveci, restoran) alanına girince web bildirimleri gösteren ve QR barkod ile kampanyayı kullanmasına izin veren bir React web uygulamasıdır.

## 🚀 Özellikler

- 📍 **Konum Tabanlı Algılama**: Web Geolocation API ile kullanıcının konumunu takip eder
- 🔔 **Web Bildirimleri**: Yakındaki kampanyalar için otomatik bildirim gönderir
- 📱 **Responsive Tasarım**: Mobil ve masaüstü cihazlarda mükemmel görünüm
- 🎯 **QR Kod Entegrasyonu**: Kampanya barkodlarını QR kod olarak gösterir
- 💾 **Yerel Depolama**: Kullanılan kampanyaları localStorage'da saklar
- ⚡ **Modern Teknolojiler**: React + TypeScript + Vite ile hızlı geliştirme

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)

### Adımlar

1. **Proje dizinine gidin:**
   ```bash
   cd near-deals-web
   ```

2. **Bağımlılıkları kurun:**
   ```bash
   npm install
   ```

3. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

4. **Tarayıcıda açın:**
   ```
   http://localhost:5173
   ```

## 📱 Kullanım

### İlk Kurulum
1. Tarayıcıda uygulamayı açın
2. Konum izni verin (tarayıcı isteyecek)
3. Bildirim izni verin (opsiyonel ama önerilir)

### Kampanya Algılama
- Uygulama sürekli konumunuzu takip eder
- Anlaşmalı işletmelere yaklaştığınızda otomatik bildirim alırsınız
- Bildirime tıklayarak kampanya detaylarını görebilirsiniz

### Kampanya Kullanımı
1. Kampanya modalını açın
2. QR kodu kasada gösterin veya barkod metnini paylaşın
3. "Barkodu Kullan" butonuna tıklayın
4. Kampanya kaydedilir ve localStorage'a yazılır

## 🏪 Test İşletmeleri

Uygulama şu test lokasyonları ile gelir:

### X Marka Kahve - Taksim
- **Konum**: 41.0369, 28.9850 (120m yarıçap)
- **Kampanya**: Kahve + Tatlı Paketi
- **Fiyat**: 500 TL → 400 TL

### Y Cafe - Kadıköy  
- **Konum**: 40.9905, 29.0254 (120m yarıçap)
- **Kampanya**: Filtre Kahve + Kruvasan
- **Fiyat**: 350 TL → 280 TL

## 🧪 Test Etme

### Konum Testi
1. Tarayıcının geliştirici araçlarını açın (F12)
2. Console sekmesine gidin
3. Konum koordinatlarını kontrol edin
4. Test lokasyonlarına yaklaştığınızda bildirimleri test edin

### Manuel Test
- Ana sayfadaki "Kampanyayı Görüntüle" butonları ile kampanyaları manuel olarak açabilirsiniz
- QR kodların doğru oluşturulduğunu kontrol edin

## 🔧 Geliştirme

### Build
```bash
npm run build
```

### Preview (Production Build)
```bash
npm run preview
```

### Proje Yapısı
```
src/
├── App.tsx          # Ana uygulama bileşeni
├── main.tsx         # React giriş noktası
└── style.css        # CSS stilleri
```

## 🌐 Tarayıcı Uyumluluğu

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Gerekli Web API'ları
- Geolocation API
- Notifications API
- localStorage

## 📋 Özellik Planları

- [ ] PWA (Progressive Web App) desteği
- [ ] Offline çalışma
- [ ] Push bildirimleri
- [ ] Kullanıcı hesapları
- [ ] Kampanya geçmişi
- [ ] Sosyal paylaşım
- [ ] Harita entegrasyonu

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Sorun Giderme

### Konum İzni Verilmiyor
- Tarayıcı ayarlarından site için konum iznini kontrol edin
- HTTPS kullanın (localhost hariç)

### Bildirimler Gelmiyor
- Tarayıcı ayarlarından bildirim iznini kontrol edin
- Bildirim engelleyicilerini kapatın

### QR Kod Görünmüyor
- JavaScript konsolunda hata var mı kontrol edin
- React-QR-Code kütüphanesinin doğru yüklendiğini kontrol edin

---

**Not**: Bu uygulama demo amaçlıdır. Gerçek üretim kullanımı için backend entegrasyonu ve güvenlik önlemleri gereklidir.
