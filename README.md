# Sahabat Ilmu

Sahabat Ilmu adalah aplikasi web untuk membantu pengguna mencari dalil, kajian, dan pengetahuan agama dengan alur yang mudah dipindai: tanyakan topik, baca ringkasan awal, lalu buka sumber rujukan.

Project ini memakai Next.js App Router, PostgreSQL via Neon, Drizzle ORM, NextAuth, UploadThing, TipTap, dan Google Generative AI. Area publik sudah didesain ulang dengan gaya editorial calm, warna paper, hijau tua, dan aksen gold.

## Fitur Utama

- Halaman publik: beranda, chat, kajian, detail kajian, tentang, support, login, dan register.
- Chat Sahabat Ilmu: antarmuka seperti ruang chat khusus untuk mencari topik agama.
- Source-first answer: jawaban AI diarahkan sebagai ringkasan awal dari referensi yang dikembalikan flow Yufid, bukan pengganti membaca sumber asli.
- Guard prompt: sapaan dan small talk dijawab lokal; sisipan teknis seperti permintaan kode dipisahkan dari pertanyaan agama sebelum request dikirim ke API.
- Kajian: daftar kajian publik, halaman detail, metadata SEO, cover image, kategori, ustadz, lokasi, dan tanggal.
- Dashboard admin: pengelolaan pengguna, konten, upload gambar, rich text editor, import dokumen, dan activity logs.
- Auth: login/register berbasis credentials, Google OAuth, dan email OTP via Resend dengan NextAuth dan role `SUPER_ADMIN` / `AUTHOR`.

## Source Safety Chat

Religious answer flow harus dijaga:

- `/api/chat` menerima query agama yang sudah disaring dari UI.
- API mencari referensi melalui konfigurasi Google Custom Search/Yufid, lalu mengambil konten sumber yang relevan.
- AI merangkum hasil tersebut dan UI menampilkan sumber di bawah jawaban.
- Jika tidak ada sumber cukup, UI memakai wording netral dan tidak memaksa kesimpulan hukum.
- Pertanyaan campuran seperti "hukum musik ... dan buat kode Python" akan disaring: bagian kode diabaikan, bagian agama tetap diproses.

Catatan penting: kualitas sumber sangat bergantung pada `GOOGLE_CSE_API_KEY` dan `YUFID_CSE_ID`. Untuk production, pastikan Custom Search Engine diarahkan ke sumber yang memang ingin dijadikan rujukan.

## Tech Stack

- Next.js `16.0.10`
- React `19.2.3`
- TypeScript
- Tailwind CSS 4
- Drizzle ORM
- Neon PostgreSQL
- NextAuth.js
- Google Generative AI
- Resend Email API
- Cheerio
- UploadThing
- TipTap
- Lucide React

## Prasyarat

- Node.js 20 atau lebih baru
- npm
- Database PostgreSQL, disarankan Neon
- Gemini API key
- Google Custom Search API key dan Custom Search Engine ID untuk flow Yufid
- Google OAuth Client ID/Secret untuk login Google
- Resend API key untuk kode OTP email
- Konfigurasi UploadThing jika fitur upload dipakai

## Instalasi

```bash
git clone https://github.com/hmad28/sahabat-ilmu.git
cd sahabat-ilmu
npm install
```

## Environment Variables

Buat `.env.local` di root project.

```env
DATABASE_URL="postgresql://user:password@host/database"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-me"

GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="Sahabat Ilmu <noreply@sahabatilmu.web.id>"

GEMINI_API_KEY="your-gemini-api-key"
GOOGLE_CSE_API_KEY="your-google-custom-search-api-key"
YUFID_CSE_ID="your-yufid-custom-search-engine-id"

# UploadThing, isi sesuai dashboard UploadThing yang dipakai project
UPLOADTHING_TOKEN="your-uploadthing-token"
```

Jika memakai konfigurasi UploadThing lama, sesuaikan env UploadThing dengan dashboard akun kamu.

## Login Google

Flow Google memakai NextAuth provider `google`.

Cara ambil key:

1. Buka Google Cloud Console.
2. Buat atau pilih project.
3. Buka `APIs & Services` > `OAuth consent screen`, isi app name, support email, dan developer contact.
4. Buka `APIs & Services` > `Credentials` > `Create Credentials` > `OAuth client ID`.
5. Pilih `Web application`.
6. Tambahkan Authorized redirect URI:

```text
http://localhost:3000/api/auth/callback/google
https://sahabatilmu.web.id/api/auth/callback/google
```

7. Copy `Client ID` ke `GOOGLE_CLIENT_ID`.
8. Copy `Client secret` ke `GOOGLE_CLIENT_SECRET`.

Rujukan resmi: https://support.google.com/cloud/answer/15549257

Pastikan `NEXTAUTH_URL` sesuai domain yang sedang dipakai:

```env
NEXTAUTH_URL="http://localhost:3000"
```

Untuk production:

```env
NEXTAUTH_URL="https://sahabatilmu.web.id"
```

## Email OTP Resend

Flow OTP memakai endpoint `/api/auth/otp/request`, tabel `login_otp_codes`, dan NextAuth provider `email-otp`.

Cara ambil key:

1. Buka Resend Dashboard.
2. Buka `API Keys`.
3. Klik `Create API Key`.
4. Pilih permission untuk send email.
5. Copy key ke `RESEND_API_KEY`.
6. Untuk production, buka `Domains`, tambahkan domain, lalu pasang DNS record yang diminta Resend.
7. Isi `EMAIL_FROM` dengan email dari domain yang sudah verified.

Rujukan resmi:

- API Keys: https://resend.com/docs/dashboard/api-keys/introduction
- Domains: https://resend.com/docs/dashboard/domains/introduction

Contoh:

```env
RESEND_API_KEY="re_xxxxxxxxx"
EMAIL_FROM="Sahabat Ilmu <noreply@sahabatilmu.web.id>"
```

Untuk production Sahabat Ilmu, pakai:

```env
EMAIL_FROM="Sahabat Ilmu <noreply@sahabatilmu.web.id>"
```

Untuk tes awal, Resend menyediakan alamat sandbox `onboarding@resend.dev`, tapi pengiriman biasanya terbatas ke email akun Resend kamu. Production sebaiknya pakai domain verified.

## Database

Schema Drizzle ada di `db/schema.ts`, config ada di `drizzle.config.ts`.

Push schema ke database:

```bash
npx drizzle-kit push
```

Buka Drizzle Studio:

```bash
npx drizzle-kit studio
```

Ada script seed super admin di `scripts/seed-super-admin.ts`. Ubah email/password default sebelum dipakai.

## Menjalankan Local

```bash
npm run dev
```

Buka:

```text
http://localhost:3000
```

Halaman penting:

- `/` - beranda publik
- `/chat` - chat Sahabat Ilmu
- `/kajian` - daftar kajian
- `/kajian/[slug]` - detail kajian
- `/about` - tentang aplikasi
- `/support` - dukungan
- `/login` dan `/register` - auth
- `/dashboard` - area admin

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # start production server
npm run lint     # ESLint
```

Catatan Windows: jika `npm run build` gagal di tahap static generation dengan error worker seperti `spawn UNKNOWN` atau `VirtualAlloc failed`, tutup dev server/proses Node lain lalu ulangi build.

## Struktur Project

```text
app/
  api/                 API routes: auth, chat, kajian, upload, admin
  chat/                halaman chat publik
  dashboard/           area admin
  kajian/              daftar dan detail kajian
  login/ register/     halaman auth
  about/ support/      halaman publik
components/
  public/              PublicNav, PublicFooter, YufidChat, SourceNotice
  ActivityLogs.tsx
  AdminTable.tsx
  KajianSidebar.tsx
  RichTextEditor.tsx
db/
  index.ts             koneksi Neon + Drizzle
  schema.ts            schema database
lib/
  auth.ts              NextAuth config
  activity-logger.ts
  seo-utils.ts
  uploadthing.ts
scripts/
  seed-super-admin.ts
public/
  images dan aset brand
```

## Deployment

Project bisa dideploy ke Vercel atau hosting Next.js lain.

Checklist production:

- Set semua environment variables production.
- Set `NEXTAUTH_URL` ke domain production.
- Set Google OAuth redirect URI production.
- Verifikasi domain Resend sebelum memakai `EMAIL_FROM` domain sendiri.
- Pastikan database sudah terisi schema.
- Pastikan Custom Search Engine untuk Yufid sudah benar.
- Jalankan `npm run build` sebelum deploy jika ingin validasi lokal.

Domain production yang dipakai project:

```text
https://sahabatilmu.web.id
```

## Troubleshooting

Chat menjawab "tidak menemukan artikel":

- Coba query lebih pendek, misalnya `hukum musik`, `dalil menjaga lisan`, atau `tata cara wudhu`.
- Pastikan `GOOGLE_CSE_API_KEY` dan `YUFID_CSE_ID` benar.
- Cek apakah Custom Search Engine mengembalikan sumber yang relevan.

Login gagal:

- Cek `DATABASE_URL`.
- Cek user sudah ada di tabel `users`.
- Cek `NEXTAUTH_SECRET`.
- Untuk Google, cek `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, callback URL, dan `NEXTAUTH_URL`.
- Untuk OTP email, cek `RESEND_API_KEY`, `EMAIL_FROM`, domain Resend sudah verified, dan tabel `login_otp_codes` sudah termigrasi.

Upload gagal:

- Cek konfigurasi UploadThing.
- Cek limit file image di `app/api/uploadthing/core.ts`.

## Catatan Pengembangan

- Jangan menaruh klaim agama statis tanpa sumber.
- Untuk copy UX biasa, boleh ditulis manual.
- Untuk hukum, dalil, atau ajaran, gunakan hasil flow sumber dan tampilkan link sumber.
- Backend chat sudah punya flow pencarian/scraping/generasi; perubahan UI sebaiknya tidak mematahkan kontrak `/api/chat`.

## Repository

- GitHub: https://github.com/hmad28/sahabat-ilmu
- License: Private project
