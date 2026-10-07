# Bateri Akademisi — Tasarım Özeti

## Amaç ve hedef kitle

Türkçe konuşan baterist adaylarının temel nota bilgisinden ileri groove ve fill çalışmalarına kadar kendi hızlarında öğrenebileceği, pratik ağırlıklı ve her seviyeye uygun bir web atölyesi. Üyelik veya sunucu gerektirmeden, doğrudan tarayıcıda kullanılacak.

## Önerilen yaklaşım

Etkileşimli ritim laboratuvarı: kavramları kısa derslerle anlatır, hemen ardından pad, metronom veya ritim örneğiyle deneme olanağı verir. Statik bir ders kitabından daha fazla pratik sağlar; topluluk, hesap ve bulut senkronizasyonunun gerektirdiği backend kapsamından kaçınır.

## Bilgi mimarisi

- **Ana panel:** Öğrenme yolunu, seviyeleri, ilerlemeyi ve devam edilecek dersi gösterir.
- **Dersler:** Nota süreleri ve suslar; ölçü, tempo ve sayım; bateri seti notasyonu; el-ayak koordinasyonu; temel rudiment'ler; groove ve fill geliştirme.
- **Ritim laboratuvarı:** Klavye ile çalınabilen bateri pad'leri, BPM ayarlı metronom ve basit 4/4 pattern editörü.
- **Sözlük / referans:** Nota ve set elemanları için hızlı başvuru kartları.
- **İlerleme:** Tamamlanan dersler ve seçili pratik ayarları `localStorage` içinde tutulur; ağ veya kullanıcı hesabı gerekmez.

## Görsel ve etkileşim yönü

Açık nota defteri atmosferi; krem ve beyaz yüzeyler, mürekkep siyahı çizgiler ve sıcak kırmızı-turuncu vurgular. Nota çizgileri, ritim işaretleri ve editoryal tipografi arayüze görsel karakter verir. Geniş ekranda gezinme ve ders içeriği arasında belirgin hiyerarşi; mobilde tek sütuna inen, dokunmaya uygun kontroller. Hareketler kısa ve işlevsel, `prefers-reduced-motion` ayarına saygılı.

## Uygulama sınırları

- Tek sayfalı, statik olarak barındırılabilir web uygulaması.
- Türkçe arayüz ve içerik.
- Ses üretimi Web Audio API ile istemci tarafında; ilk kullanıcı etkileşiminde ses bağlamı başlatılır.
- Pad klavye kısayolları görünür biçimde açıklanır ve metin alanlarına yazarken tetiklenmez.
- Metronom, tempo değişiminde zamanlama kaymasını azaltacak şekilde planlı audio zamanlaması kullanır.
- Ders tamamlanması isteğe bağlıdır; saklama kullanılamazsa eğitim içeriği çalışmaya devam eder.

## Kapsam dışı

Kullanıcı hesabı, sunucu/API, bulut ilerleme senkronizasyonu, canlı öğretmen bağlantısı, MIDI cihaz desteği ve gerçek akustik davuldan mikrofonla analiz.

## Başarı ölçütleri ve doğrulama

- Türkçe içerik, her seviyeye uygun öğrenme yolunda düzenli ve gezinilebilir olmalı.
- Pad, metronom, pattern kontrolleri ve yerel ilerleme gerçek davranış göstermeli.
- Masaüstü ve dar mobil görünümde temel akışlar taşma veya klavye erişimi sorunu olmadan kullanılmalı.
- Proje, ek servis kurulumu gerektirmeden geliştirici sunucusunda çalışmalı ve GitHub Pages gibi statik bir barındırmaya uygun olmalı.
- Doğrulama: proje komutları ile derleme/lint kontrolü; mümkünse Playwright üzerinden ana gezinme, pad etkileşimi ve mobil görünüm kontrolü.
