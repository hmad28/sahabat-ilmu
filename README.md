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

## ⚠️ Solusi Masalah Search

Yufid.com menggunakan **Google Custom Search Engine (CSE)** yang render hasil dengan JavaScript. Ada 3 solusi:

### Opsi 1: Google Custom Search API (RECOMMENDED) ✅

**Kelebihan:**
- Paling akurat & reliable
- Legal & official
- Gratis 100 queries/hari

**Setup:**
1. Buka https://developers.google.com/custom-search/v1/introduction
2. Klik "Get a Key" → Buat project baru
3. Copy API key ke `.env.local`:
   ```
   GOOGLE_CSE_API_KEY=your_api_key
   ```
4. Dapatkan Yufid CSE ID:
   - Buka https://yufid.com/result.html
   - View source (Ctrl+U)
   - Cari "cx" atau "cse_id" 
   - Atau hubungi admin yufid.com
5. Tambahkan ke `.env.local`:
   ```
   YUFID_CSE_ID=yufid_cse_id
   ```

### Opsi 2: Google Search Scraping (Fallback - sudah di-implement)

Code akan otomatis fallback ke scraping Google dengan query `site:yufid.com`.

**Limitasi:**
- Bisa kena rate limit
- Kurang stable
- Struktur HTML Google sering berubah

### Opsi 3: Build Database Sendiri

Scrape yufid.com sekali, simpan di database lokal/Supabase.

**Kelebihan:**
- Paling cepat
- Tidak depend ke external service
- Full control

**Setup:**
```bash
# Install Supabase client
npm install @supabase/supabase-js

# Buat scraper script
node scripts/scrape-yufid.js
```

## Kustomisasi

### Ubah Prompt AI

Edit di `app/api/chat/route.js` bagian prompt untuk mengubah gaya jawaban AI.

### Ubah Keywords Filter

Edit array `religiousKeywords` di fungsi `isReligiousQuestion()` untuk menambah/kurangi keyword deteksi.

### Styling

Edit komponen React dengan class Tailwind CSS sesuai selera.

## Deploy

### Deploy ke Vercel

## 🚀 Quick Start (Tanpa Setup API)

Untuk testing cepat tanpa perlu Google CSE API:

```bash
npm install
npm run dev
```

Code akan otomatis fallback ke Google search scraping. Cukup set `GEMINI_API_KEY` saja.

## ⚡ Cara Optimal (Setup Google CSE API)

### Step 1: Gemini API Key

1. Buka https://makersuite.google.com/app/apikey
2. Login → Create API Key
3. Copy ke `.env.local`:
```bash
GEMINI_API_KEY=your_gemini_api_key
```

### Step 2: Google Custom Search API (Opsional tapi Recommended)

1. **Buat API Key:**
   - Buka https://developers.google.com/custom-search/v1/introduction
   - Klik "Get a Key" → Create new project
   - Enable "Custom Search API"
   - Copy API key

2. **Dapatkan Yufid CSE ID:**
   
   **Cara 1: View Source**
   - Buka https://yufid.com/result.html
   - Klik kanan → View Page Source (Ctrl+U)
   - Cari kata "cx" atau "cse_id"
   - Contoh: `cx: '012345678901234567890:abcdefghijk'`
   
   **Cara 2: Network Tab**
   - Buka yufid.com/result.html
   - F12 → Network tab
   - Search sesuatu
   - Lihat request ke `cse.google.com`
   - Parameter `cx` adalah CSE ID

3. **Set Environment Variables:**
```bash
GOOGLE_CSE_API_KEY=your_google_cse_api_key
YUFID_CSE_ID=yufid_cse_id
```

### Step 3: Test Search

```bash
# Test search functionality
node scripts/test-search.js
```

## 📝 Troubleshooting

### Problem: "Tidak menemukan artikel di yufid.com"

**Penyebab:**
- Google search scraping kena rate limit
- Struktur HTML Google berubah
- Yufid CSE tidak mereturn hasil

**Solusi:**

1. **Setup Google CSE API** (recommended)
2. **Gunakan Puppeteer** untuk render JavaScript:
   ```bash
   npm install puppeteer
   ```
   Lihat file `puppeteer-alternative.js` untuk implementasi

3. **Build database lokal:**
   ```bash
   # Scrape semua artikel yufid sekali
   node scripts/scrape-yufid.js
   # Simpan ke Supabase/JSON file
   ```

### Problem: Search lambat

- Set timeout lebih besar di `fetch()`
- Gunakan caching (Redis/Vercel KV)
- Build database lokal

### Problem: Jawaban tidak akurat

- Pastikan scraping berhasil (cek console log)
- Improve prompt engineering di Gemini
- Tambah artikel yang di-scrape (dari 3 ke 5)

### Problem: Deploy ke Vercel gagal

**Untuk Puppeteer di Vercel:**
```bash
npm install @sparticuz/chromium puppeteer-core
```

**vercel.json:**
```json
{
  "functions": {
    "app/api/chat/route.js": {
      "memory": 3008,
      "maxDuration": 30
    }
  }
}
```

## Deploy

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Set environment variables di Vercel dashboard:
- `GEMINI_API_KEY` (wajib)
- `GOOGLE_CSE_API_KEY` (opsional)
- `YUFID_CSE_ID` (opsional)

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login & deploy
railway login
railway init
railway up
```

### Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t islamic-chatbot .
docker run -p 3000:3000 --env-file .env.local islamic-chatbot
```

## Lisensi

MIT License - Bebas digunakan untuk project pribadi maupun komersial.

## Kontribusi

Pull requests welcome! Untuk perubahan besar, buka issue terlebih dahulu.

---

**Catatan:** Project ini dibuat untuk tujuan edukasi. Pastikan mematuhi Terms of Service yufid.com dan Google dalam penggunaan production.