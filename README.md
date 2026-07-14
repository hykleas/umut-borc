# Umut Ardan Borç Takip Sistemi 💸

İki arkadaş arasındaki 1000 TL'lik borcun resmî(!) takip sitesi. Tamamen şakadır.

- `index.html` — ana sayfa: güncel borç, manevi faiz sayacı, borç yaşı, dönen mesajlar
- `admin.html` — yönetim paneli (şifreli): foto, borç, ödenen, mesajlar buradan güncellenir
- `api/data.js` — veriyi GitHub'daki `data.json`'dan okur
- `api/update.js` — admin panelinden gelen değişikliği `data.json`'a yazar

## Ortam değişkenleri (Vercel)

- `GITHUB_TOKEN` — data.json'u okuyup yazabilen token (repo yetkili)
- `DATA_REPO` — ör. `hykleas/umut-borc`
- `ADMIN_PASSWORD` — yönetim paneli şifresi
