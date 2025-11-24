# Chatbot Agama Islam - Yufid.com

Chatbot AI berbasis Next.js dan Gemini AI yang khusus menjawab pertanyaan agama Islam dengan sumber terpercaya dari yufid.com.

## Fitur

- ✅ Hanya menjawab pertanyaan seputar agama Islam
- ✅ Semua jawaban diambil dari yufid.com (tidak dari pengetahuan AI sendiri)
- ✅ Dilengkapi dalil Al-Quran dan Hadits beserta riwayatnya
- ✅ Bahasa yang mudah dipahami untuk orang awam
- ✅ Sumber referensi yang jelas dari yufid.com
- ✅ Otomatis redirect pertanyaan non-agama ke topik agama

## Teknologi

- **Next.js 14** - Framework React
- **Gemini AI** - AI Engine dari Google
- **Cheerio** - Web scraping
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Instalasi

### 1. Clone atau buat project baru

```bash
npx create-next-app@latest islamic-chatbot
cd islamic-chatbot
```

### 2. Install dependencies

```bash
npm install @google/generative-ai cheerio lucide-react
```

### 3. Struktur Folder

```
islamic-chatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js          # API endpoint
│   ├── page.js                   # Halaman utama (chatbot UI)
│   ├── layout.js
│   └── globals.css
├── .env.local                    # Environment variables
├── package.json
└── tailwind.config.js
```

### 4. Setup Environment Variables

Buat file `.env.local` di root folder:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

**Cara mendapatkan Gemini API Key:**
1. Kunjungi https://makersuite.google.com/app/apikey
2. Login dengan akun Google
3. Klik "Create API Key"
4. Copy API key dan paste ke `.env.local`

### 5. Konfigurasi Tailwind CSS

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**app/globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 6. File Utama

**app/page.js** - Copy komponen React dari artifact pertama

**app/api/chat/route.js** - Copy kode API dari artifact kedua

### 7. Jalankan Development Server

```bash
npm run dev
```

Buka http://localhost:3000

## Cara Kerja

1. **User mengirim pertanyaan** → Sistem cek apakah pertanyaan tentang agama
2. **Jika bukan agama** → Bot meminta user untuk bertanya tentang agama
3. **Jika tentang agama** → Search di yufid.com menggunakan Google
4. **Scrape konten** → Ambil artikel dari top 3 hasil pencarian
5. **Generate jawaban** → Gemini AI menganalisis konten dan menjawab
6. **Return response** → Jawaban + dalil + sumber dari yufid.com

## Penting!

### Limitasi & Alternatif

Kode ini menggunakan web scraping sederhana yang mungkin:
- Terkena rate limit oleh Google
- Tidak selalu mendapatkan hasil akurat
- Melanggar Terms of Service

### Solusi Alternatif (Lebih Baik):

1. **Gunakan Google Custom Search API**
   - Daftar di: https://developers.google.com/custom-search
   - Lebih reliable dan legal
   - Gratis 100 queries/hari

2. **Integrasi dengan Yufid API** (jika tersedia)
   - Hubungi yufid.com untuk akses API
   - Lebih cepat dan akurat

3. **Build Database Sendiri**
   - Scrape sekali saja dan simpan di database
   - Update berkala
   - Lebih cepat response time

## Kustomisasi

### Ubah Prompt AI

Edit di `app/api/chat/route.js` bagian prompt untuk mengubah gaya jawaban AI.

### Ubah Keywords Filter

Edit array `religiousKeywords` di fungsi `isReligiousQuestion()` untuk menambah/kurangi keyword deteksi.

### Styling

Edit komponen React dengan class Tailwind CSS sesuai selera.

## Deploy

### Deploy ke Vercel

```bash
npm install -g vercel
vercel
```

Jangan lupa set environment variable `GEMINI_API_KEY` di Vercel dashboard.

## Troubleshooting

### Error: Cannot find module 'cheerio'
```bash
npm install cheerio
```

### Error: GEMINI_API_KEY not found
- Pastikan file `.env.local` ada
- Restart development server setelah menambah env variable

### Tidak dapat hasil dari yufid.com
- Cek koneksi internet
- Kemungkinan struktur HTML yufid.com berubah
- Perlu update selector cheerio

## Lisensi

MIT License - Bebas digunakan untuk project pribadi maupun komersial.

## Kontribusi

Pull requests welcome! Untuk perubahan besar, buka issue terlebih dahulu.

---

**Catatan:** Project ini dibuat untuk tujuan edukasi. Pastikan mematuhi Terms of Service yufid.com dan Google dalam penggunaan production.