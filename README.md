# 📚 Sahabat Ilmu

> Platform pembelajaran kajian Islami berbasis web dengan teknologi modern dan AI-powered chatbot

[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red)]()

## 🌟 Tentang Proyek

**Sahabat Ilmu** adalah platform pembelajaran yang menyediakan konten kajian Islami berkualitas dengan antarmuka modern dan intuitif. Platform ini dilengkapi dengan fitur chatbot AI untuk membantu pengguna dalam proses pembelajaran mereka.

### ✨ Fitur Utama

- 🔐 **Autentikasi & Otorisasi** - Sistem login/register dengan NextAuth.js dan role-based access control
- 📝 **Rich Text Editor** - Editor konten lengkap menggunakan TipTap dengan formatting toolbar
- 🤖 **AI Chatbot** - Asisten pembelajaran interaktif powered by Google Generative AI
- 📊 **Dashboard Admin** - Panel manajemen pengguna dan konten dengan analytics
- 📈 **Activity Logging** - Pelacakan aktivitas pengguna secara real-time
- 🔍 **SEO Optimized** - Dynamic metadata, sitemap, dan Open Graph tags
- 📱 **Responsive Design** - Tampilan optimal di semua perangkat
- 🚀 **Upload Files** - Integrasi UploadThing untuk mengelola file dan gambar
- 📄 **Document Parser** - Import konten dari file Word (.docx)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.3 (App Router)
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.0
- **Rich Text**: TipTap 3.11.0
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Drizzle ORM 0.44.7
- **Authentication**: NextAuth.js 4.24.13

### External Services
- **AI**: Google Generative AI 0.24.1
- **File Upload**: UploadThing 7.7.4
- **Hosting**: Vercel

## 📋 Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** 20.x atau lebih tinggi
- **npm** atau **yarn** package manager
- **PostgreSQL Database** (Neon recommended)
- **Google AI API Key**
- **UploadThing Account**

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/hmad28/sahabat-ilmu.git
cd sahabat-ilmu
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root folder dan isi dengan konfigurasi berikut:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host/database"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Google AI API
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# UploadThing Configuration
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Optional: Node Environment
NODE_ENV="development"
```

### 4. Setup Database

Jalankan migrasi database menggunakan Drizzle:

```bash
npm run db:push
```

### 5. Seed Super Admin (Opsional)

Buat akun super admin pertama:

```bash
npx ts-node scripts/seed-super-admin.ts
```

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📁 Struktur Proyek

```
sahabat-ilmu/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── activity-logs/ # Activity logging endpoints
│   │   ├── admin/         # Admin management endpoints
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── chat/          # Chatbot AI endpoints
│   │   ├── kajian/        # Kajian CRUD endpoints
│   │   └── uploadthing/   # File upload endpoints
│   ├── dashboard/         # Dashboard pages
│   ├── kajian/            # Kajian pages
│   ├── login/             # Login page
│   ├── register/          # Register page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ActivityLogs.tsx   # Activity logs display
│   ├── AdminTable.tsx     # Admin user table
│   ├── KajianSidebar.tsx  # Kajian navigation
│   ├── RichTextEditor.tsx # Content editor
│   └── SessionProvider.tsx # Auth session provider
├── db/                    # Database
│   └── schema.ts          # Drizzle schema
├── lib/                   # Utilities
│   ├── auth.ts            # NextAuth config
│   ├── activity-logger.ts # Activity logging utils
│   ├── seo-utils.ts       # SEO helpers
│   └── uploadthing.ts     # Upload config
├── public/                # Static assets
├── scripts/               # Utility scripts
│   └── seed-super-admin.ts
└── drizzle.config.mjs     # Drizzle configuration
```

## 📜 Scripts Tersedia

```bash
# Development
npm run dev          # Jalankan development server

# Production
npm run build        # Build untuk production
npm run start        # Jalankan production server

# Code Quality
npm run lint         # Jalankan ESLint

# Database
npm run db:push      # Push schema ke database
npm run db:studio    # Buka Drizzle Studio
```

## 🔑 Fitur Detail

### 1. Sistem Autentikasi
- Registrasi pengguna dengan validasi email
- Login dengan email dan password
- Password hashing menggunakan bcryptjs
- Session management dengan NextAuth.js
- 3 level user role: User, Admin, Super Admin

### 2. Manajemen Kajian
- Create, Read, Update, Delete kajian
- Rich text editor dengan fitur:
  - Bold, Italic, Underline
  - Text alignment
  - Hyperlinks
  - Headings dan paragraphs
- SEO-friendly slug generation
- Upload gambar cover
- Import dari dokumen Word

### 3. Dashboard Admin
- Daftar semua pengguna dengan filtering
- Edit dan delete user accounts
- View activity logs
- Statistik pengguna dan konten
- Content moderation tools

### 4. AI Chatbot
- Powered by Google Generative AI
- Context-aware conversations
- Membantu menjawab pertanyaan seputar kajian
- Response streaming untuk UX yang lebih baik

### 5. Activity Tracking
- Log setiap aktivitas penting pengguna
- Timestamp dan metadata lengkap
- Visualisasi di dashboard
- Export data untuk analytics

## 🔒 Keamanan

Proyek ini menerapkan best practices keamanan:

- ✅ Password hashing dengan bcryptjs (salt rounds: 10)
- ✅ CSRF protection melalui NextAuth
- ✅ Environment variables untuk data sensitif
- ✅ Input validation dan sanitization
- ✅ Role-based access control (RBAC)
- ✅ Secure HTTP-only cookies untuk session
- ✅ SQL injection prevention via Drizzle ORM

## 📱 Responsive Design

Platform dioptimalkan untuk semua ukuran layar:

- 🖥️ Desktop (1920px+)
- 💻 Laptop (1024px - 1919px)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (320px - 767px)

## 🌐 Deployment

### Deploy ke Vercel (Recommended)

1. Push kode ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables di Vercel dashboard
4. Deploy!

```bash
# Atau gunakan Vercel CLI
npm i -g vercel
vercel
```

### Environment Variables untuk Production

Pastikan semua environment variables sudah diset di platform hosting:
- `DATABASE_URL`
- `NEXTAUTH_URL` (ganti dengan domain production)
- `NEXTAUTH_SECRET`
- `GOOGLE_AI_API_KEY`
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Cek DATABASE_URL di .env.local
# Pastikan format: postgresql://user:password@host:port/database
```

### NextAuth Session Error
```bash
# Generate NEXTAUTH_SECRET baru
openssl rand -base64 32
```

### UploadThing Upload Failed
```bash
# Verifikasi UPLOADTHING_SECRET dan UPLOADTHING_APP_ID
# Cek quota di dashboard UploadThing
```

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Private Project - All Rights Reserved

## 👨‍💻 Author

**hmad28**

- GitHub: [@hmad28](https://github.com/hmad28)
- Project Link: [https://github.com/hmad28/sahabat-ilmu](https://github.com/hmad28/sahabat-ilmu)
- Live Demo: [https://sahabat-ilmu.vercel.app/](https://sahabat-ilmu.vercel.app/)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Google AI](https://ai.google.dev/) - Generative AI
- [UploadThing](https://uploadthing.com/) - File uploads
- [TipTap](https://tiptap.dev/) - Rich text editor

## 📞 Support

Jika ada pertanyaan atau menemukan bug, silakan buat issue di [GitHub Issues](https://github.com/hmad28/sahabat-ilmu/issues).

---

<div align="center">
  <strong>Dibuat dengan ❤️ untuk pembelajaran yang lebih baik</strong>
</div>
