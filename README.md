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
- Auth: login/register berbasis credentials dengan NextAuth dan role `SUPER_ADMIN` / `AUTHOR`.

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

GEMINI_API_KEY="your-gemini-api-key"
GOOGLE_CSE_API_KEY="your-google-custom-search-api-key"
YUFID_CSE_ID="your-yufid-custom-search-engine-id"

# UploadThing, isi sesuai dashboard UploadThing yang dipakai project
UPLOADTHING_TOKEN="your-uploadthing-token"
```

Jika memakai konfigurasi UploadThing lama, sesuaikan env UploadThing dengan dashboard akun kamu.

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
