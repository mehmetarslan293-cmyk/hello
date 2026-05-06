# Backend ve Veritabani

Bu projeye Prisma + SQLite tabanli backend iskeleti eklendi.

## Kurulum

1. Ortam degiskenlerini hazirla:
   - `.env` dosyasinda `DATABASE_URL="file:./dev.db"`
2. Prisma client uret ve veritabanini olustur:
   - `npm run prisma:generate`
   - `npm run prisma:push`
3. Ornek veriyi yukle (opsiyonel):
   - `npm run prisma:seed`

## Veritabani kapsami

Asagidaki alanlar icin tablo/model olusturuldu:

- Kullanici ve roller (`ADMIN`, `BRAND`, `INFLUENCER`)
- Marka profili, influencer profili, sosyal hesaplar
- Kampanya, basvuru, deliverable/icerik onay akisi
- Cuzdan, finansal islemler, para cekim talebi
- Abonelik planlari, abonelikler, faturalar
- Mesajlasma thread/mesaj, bildirimler
- Destek talepleri, trend videolari, audit log

## API route'lari

- `GET /api/health`
- `POST /api/auth/brand/register`
- `POST /api/auth/brand/login`
- `POST /api/auth/influencer/register`
- `POST /api/auth/influencer/login`
- `GET /api/brand/dashboard?userId=...`
- `GET /api/influencer/dashboard?userId=...`
- `GET /api/campaigns`
- `POST /api/campaigns`
- `GET /api/applications`
- `POST /api/applications`
- `POST /api/wallets/withdrawals`

## Demo hesaplar (seed sonrasi)

- Admin: `admin@example.com` / `Admin12345`
- Marka: `brand@example.com` / `Brand12345`
- Influencer: `influencer@example.com` / `Influencer12345`

> Not: Sifre hashleme demo amaclidir. Uretimde bcrypt/argon2 + JWT/session + RBAC + rate limit + audit zorunludur.
