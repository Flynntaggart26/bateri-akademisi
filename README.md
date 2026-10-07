# Bateri Akademisi 🥁

Türkçe, her seviyeye uygun bateri öğrenme atölyesi. Nota bilgisini, ritim sayımını ve bateri tekniğini kısa derslerle anlatır; duyduklarını pad’lerde ve ritim makinesinde denemeni sağlar.

## Özellikler

- Nota değerleri, bateri notasyonu, tempo ve ölçü için görsel rehber
- Başlangıç, orta ve ileri seviyelere ayrılmış 10 kısa ders
- Tamamlanan dersleri ve metronom temposunu bu tarayıcıda saklayan ilerleme takibi
- Web Audio ile üretilen kick, trampet, hi-hat ve tom sesleri
- 40–220 BPM metronom ve dokunarak tempo bulma
- Klavye veya dokunmatik ekranla kullanılabilen 16 adımlı ritim makinesi
- Mobil uyumlu düzen ve klavye ile gezinilebilir kontroller

## Çalıştırma

Derleme veya bağımlılık kurulumu gerekmez. Proje klasöründe basit bir yerel sunucu başlat:

```sh
python -m http.server 8000
```

Ardından `http://localhost:8000` adresini aç. Ses başlatmak için bir pad’e veya oynatma düğmesine dokun.

## Testler

```sh
node --test
```

## Klavye kısayolları

| Tuş | Ses |
| --- | --- |
| `1` | Kick / bas davul |
| `2` | Trampet |
| `3` | Hi-hat |
| `4` | Tom |

İlerleme, hesabın olmadığı bu sürümde yalnızca aynı tarayıcıda saklanır. Ses örnekleri Web Audio ile yerel olarak üretilir.
