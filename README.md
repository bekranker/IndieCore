# 📊 XLSX Visualizer & Brevo Contact Importer

Bu proje, `.xlsx` formatında bir Excel dosyasını yükleyip, içerisindeki verileri tablo halinde görselleştirmenizi ve ardından Brevo (Sendinblue) API aracılığıyla e-posta ve telefon numaralarını veritabanına kaydetmenizi sağlar.

---

## 🚀 Özellikler

- `.xlsx` dosyası yükleme
- Otomatik tablo görselleştirme
- Shake animasyonlu dosya girişi ve butonlar
- Hatalı telefon numarası kontrolü
- Brevo (Sendinblue) API ile veritabanına kayıt
- Hata mesajı gösterimi
- Dinamik tabloyu kapatma / sıfırlama özelliği

---

## 📸 Ekran Görüntüleri

> Örnek ekran görüntüsü buraya eklenebilir.

---

## ⚙️ Kurulum

1. Depoyu klonlayın:
2. Gerekli bağımlılıkları yükleyin:

3. `.env` dosyanızı oluşturun:  
   Proje kök dizinine bir `.env` dosyası ekleyin ve aşağıdaki satırı yazın:

4. Uygulamayı çalıştırın:

---

## 📁 Kullanım

1. Uygulama çalıştığında bir `.xlsx` dosyası yükleyin.
2. Tabloda verileri kontrol edin.
3. `Send To Database` butonuna basarak verileri Brevo API üzerinden kayıt edin.
4. Gerekirse tabloyu kapatmak için `×` ikonuna tıklayın.

---

## 📄 Notlar

- Telefon numaraları otomatik olarak temizlenip `+90` formatına çevrilir.
- Yalnızca geçerli e-posta ve telefon numaraları veritabanına kaydedilir.
- Liste ID `6` olarak sabitlenmiştir. Gerekirse `handleSendToDatabase` fonksiyonundaki `listIds` kısmını güncelleyebilirsiniz.

---

## 💡 Geliştirici Notları

- 📦 Excel dosyası işleme: `xlsx` kütüphanesi
- 🌐 HTTP istekleri: `axios` kütüphanesi
- 💌 Brevo (Sendinblue) Contact API kullanıldı

---

## 📂 Proje Yapısı

src/ ├─ XlsxVisualizer.jsx ├─ CustomCSS.css ├─ App.jsx

---

## 🤝 Katkıda Bulun

Her türlü katkıya açığız! Pull request göndermekten çekinmeyin. :)

---

## 📜 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

---

## 🏷 Bu proje Indie Core için hazırlanmıştır.
