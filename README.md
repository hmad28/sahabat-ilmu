# 🚀 Sahabat Ilmu - Enterprise AI Knowledge Platform

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square)
![NextAuth](https://img.shields.io/badge/NextAuth-v5-purple?style=flat-square)

**Sahabat Ilmu** adalah platform pembelajaran modern berbasis AI yang dirancang untuk membantu pengguna menemukan jawaban seputar ilmu, kajian, dan pembelajaran dengan cepat, tepercaya, dan terstruktur. Dibangun dengan Next.js 16, Drizzle ORM, NextAuth v5, dan Gemini AI—platform ini siap production dengan fitur authentication, admin dashboard, content management, dan AI assistant yang powerful.

---

## 📑 Table of Contents

- [Core Features](#-core-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Deployment](#-deployment)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)

---

## ✨ Core Features

### 🔐 Authentication System (NextAuth v5)
- **Secure Authentication**: Login & Register dengan session handling
- **Session Management**: Custom SessionProvider untuk client-side session
- **Database Integration**: User data tersimpan dengan Drizzle ORM
- **Route Protection**: Middleware protection untuk admin routes
- **API Validation**: Server-side session validation

**Key Files:**
- `app/api/auth/[...nextauth]/route.ts`
- `components/SessionProvider.tsx`
- `lib/auth.ts`

### 🤖 AI Chat Assistant (Gemini-Powered)
- **Smart Responses**: Powered by Google Generative AI (Gemini)
- **Web Scraping**: Integrasi Cheerio untuk parse HTML dari sumber terpercaya
- **Custom Prompts**: Prompt engineering dengan `prompt.txt`
- **Context-Aware**: AI dapat menjawab berdasarkan konten yang di-scrape
- **Real-time API**: Fast response dengan Next.js API routes

**Key Files:**
- `app/api/chat/route.js`
- `prompt.txt`

### 📚 Kajian Content Management
Sistem CRUD lengkap untuk mengelola konten kajian/artikel.

**Features:**
- Create, Read, Update, Delete kajian
- Slug-based routing untuk SEO-friendly URLs
- Rich Text Editor untuk konten formatting
- Thumbnail upload support
- Public viewer page untuk end-users
- Admin management interface

**API Endpoints:**
- `POST /api/kajian` - Create kajian
- `GET /api/kajian` - List all kajian
- `GET /api/kajian/[id]` - Get kajian by ID
- `GET /api/kajian/slug/[slug]` - Get kajian by slug
- `PUT /api/kajian/[id]` - Update kajian
- `DELETE /api/kajian/[id]` - Delete kajian

**Key Files:**
- `app/api/kajian/route.ts`
- `app/api/kajian/[id]/route.ts`
- `app/api/kajian/slug/[slug]/route.ts`
- `app/kajian/[slug]/page.tsx`

### 🧑‍💼 Admin Dashboard
Dashboard lengkap untuk content management dan user management.

**Features:**
- User management table
- Kajian management interface
- Upload file management
- Rich text editor integration
- Sidebar navigation
- Stats & analytics (ready to extend)

**Key Files:**
- `app/dashboard/page.tsx`
- `components/AdminTable.tsx`
- `components/KajianSidebar.tsx`
- `components/RichTextEditor.tsx`

### 🗂️ File Upload System (UploadThing)
Sistem upload file yang aman dan scalable.

**Features:**
- Image upload untuk thumbnails
- File validation & sanitization
- CDN integration via UploadThing
- Secure API endpoints

**Key Files:**
- `app/api/uploadthing/core.ts`
- `app/api/uploadthing/route.ts`
- `lib/uploadthing.ts`

### 🧩 User Registration System
Complete registration flow dengan validasi.

**Features:**
- Custom registration form
- Server-side validation
- Password hashing
- Auto database entry via Drizzle

**Key Files:**
- `app/api/register/route.ts`
- `app/register/page.tsx`

### 🔎 Public Kajian Viewer
Halaman public untuk menampilkan konten kajian.

**Features:**
- SEO-optimized pages
- Clean typography
- Responsive design
- Dynamic routing dengan slug

**Key Files:**
- `app/kajian/[slug]/page.tsx`

---

## 🛠️ Tech Stack

### Frontend & Backend
- **Next.js 16** - React framework dengan Turbopack
- **React 19** - Server Components & Client Components
- **TypeScript** - Type-safe development

### Authentication & Security
- **NextAuth v5** - Modern authentication library
- **Middleware** - Route protection & session validation

### Database & ORM
- **Drizzle ORM** - Type-safe SQL toolkit
- **PostgreSQL/MySQL** - Production-grade database
- **SQL Migrations** - Version-controlled schema changes

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Custom Components** - Modular UI architecture

### AI & External Services
- **Google Generative AI** - Gemini API for chat
- **Cheerio** - HTML parsing & web scraping
- **UploadThing** - File upload service

### Development Tools
- **Turbopack** - Fast build tool
- **ESLint** - Code linting
- **TypeScript** - Static type checking

---

## 📂 Project Structure

```
sahabat-ilmu/
│
├── app/
│   ├── api/
│   │   ├── admin_users/
│   │   │   └── route.ts              # Admin user management
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # NextAuth handler
│   │   ├── chat/
│   │   │   └── route.js              # AI chat endpoint
│   │   ├── kajian/
│   │   │   ├── route.ts              # CRUD kajian
│   │   │   ├── [id]/
│   │   │   │   └── route.ts          # Get/Update/Delete by ID
│   │   │   └── slug/[slug]/
│   │   │       └── route.ts          # Get by slug
│   │   ├── register/
│   │   │   └── route.ts              # User registration
│   │   └── uploadthing/
│   │       ├── core.ts               # Upload config
│   │       └── route.ts              # Upload handler
│   │
│   ├── dashboard/
│   │   └── page.tsx                  # Admin dashboard
│   │
│   ├── kajian/
│   │   └── [slug]/
│   │       └── page.tsx              # Public kajian viewer
│   │
│   ├── login/
│   │   └── page.tsx                  # Login page
│   │
│   ├── register/
│   │   └── page.tsx                  # Registration page
│   │
│   ├── layout.tsx                    # Root layout
│   ├── page.js                       # Home page
│   └── globals.css                   # Global styles
│
├── components/
│   ├── AdminTable.tsx                # Admin data table
│   ├── KajianSidebar.tsx             # Dashboard sidebar
│   ├── RichTextEditor.tsx            # Content editor
│   └── SessionProvider.tsx           # Auth session wrapper
│
├── db/
│   ├── index.ts                      # Database connection
│   └── schema.ts                     # Drizzle schema definitions
│
├── drizzle/
│   └── migrations/                   # Database migrations
│
├── lib/
│   ├── auth.ts                       # NextAuth config
│   └── uploadthing.ts                # Upload utilities
│
├── public/
│   ├── images/
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── favicon.ico
│   └── manifest.json
│
├── scripts/
│   └── seed-super-admin.ts           # Admin seeder script
│
├── prompt.txt                        # AI system prompt
├── next.config.ts                    # Next.js config
├── drizzle.config.ts                 # Drizzle config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** or **MySQL** database
- **UploadThing** account (for file uploads)
- **Google AI API Key** (for Gemini)

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/sahabat-ilmu.git
cd sahabat-ilmu
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Setup environment variables**

Create `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sahabat_ilmu"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Google Generative AI
GEMINI_API_KEY="your-gemini-api-key"

# UploadThing
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Optional
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Generate database migrations**
```bash
npm run db:generate
```

5. **Run migrations**
```bash
npm run db:migrate
# or
npx drizzle-kit migrate
```

6. **Seed super admin (optional)**
```bash
npm run seed:admin
# or
npx tsx scripts/seed-super-admin.ts
```

7. **Start development server**
```bash
npm run dev
```

8. **Open browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server (Turbopack)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes
npm run db:studio        # Open Drizzle Studio

# Seeding
npm run seed:admin       # Seed super admin user

# Type Checking
npm run type-check       # TypeScript validation
```

---

## 🌍 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL/MySQL connection string | ✅ | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_URL` | App URL for NextAuth | ✅ | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth | ✅ | Generate with `openssl rand -base64 32` |
| `GEMINI_API_KEY` | Google AI API key | ✅ | `AIza...` |
| `UPLOADTHING_SECRET` | UploadThing secret key | ✅ | Get from uploadthing.com |
| `UPLOADTHING_APP_ID` | UploadThing app ID | ✅ | Get from uploadthing.com |
| `NEXT_PUBLIC_APP_URL` | Public app URL | ❌ | `https://sahabatilmu.com` |

---

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signin`
Login user dengan credentials.

#### POST `/api/register`
Register user baru.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "user_123"
}
```

### Kajian Endpoints

#### GET `/api/kajian`
Get all kajian (with optional filters).

**Query Parameters:**
- `limit` - Number of results (default: 10)
- `offset` - Pagination offset
- `search` - Search query

**Response:**
```json
{
  "data": [
    {
      "id": "kajian_1",
      "title": "Tauhid dalam Islam",
      "slug": "tauhid-dalam-islam",
      "excerpt": "Penjelasan lengkap...",
      "thumbnail": "https://...",
      "createdAt": "2024-11-25T10:00:00Z"
    }
  ],
  "total": 42,
  "hasMore": true
}
```

#### POST `/api/kajian`
Create new kajian (Admin only).

**Request Body:**
```json
{
  "title": "Tauhid dalam Islam",
  "slug": "tauhid-dalam-islam",
  "content": "<p>Konten lengkap...</p>",
  "excerpt": "Penjelasan singkat",
  "thumbnail": "https://..."
}
```

#### GET `/api/kajian/slug/[slug]`
Get kajian by slug (public).

#### PUT `/api/kajian/[id]`
Update kajian by ID (Admin only).

#### DELETE `/api/kajian/[id]`
Delete kajian by ID (Admin only).

### Chat Endpoint

#### POST `/api/chat`
Send message to AI assistant.

**Request Body:**
```json
{
  "message": "Apa itu tauhid?",
  "context": "optional context"
}
```

**Response:**
```json
{
  "response": "Tauhid adalah keyakinan...",
  "sources": ["https://example.com/source"],
  "timestamp": "2024-11-25T10:30:00Z"
}
```

### Upload Endpoint

#### POST `/api/uploadthing`
Upload file (authenticated users only).

---

## 🗄️ Database Schema

Key tables in Drizzle schema (`db/schema.ts`):

### Users Table
```typescript
{
  id: string (primary key)
  name: string
  email: string (unique)
  password: string (hashed)
  role: enum ('admin', 'user')
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Kajian Table
```typescript
{
  id: string (primary key)
  title: string
  slug: string (unique)
  content: text
  excerpt: string
  thumbnail: string (nullable)
  authorId: string (foreign key -> users)
  published: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Sessions Table (NextAuth)
```typescript
{
  sessionToken: string (primary key)
  userId: string (foreign key)
  expires: timestamp
}
```

---

## 🔐 Authentication Flow

### Registration Flow
1. User fills registration form
2. POST to `/api/register`
3. Server validates input
4. Password hashed with bcrypt
5. User created in database
6. Redirect to login

### Login Flow
1. User submits credentials
2. NextAuth validates against database
3. Session created
4. Session token stored
5. Client receives session cookie
6. Protected routes accessible

### Protected Routes
- `/dashboard/*` - Admin only
- `/api/kajian` (POST/PUT/DELETE) - Admin only
- `/api/admin_users` - Admin only

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Add environment variables
- Deploy

3. **Set up database**
- Use Vercel Postgres or external database
- Run migrations in production

### Deploy to VPS (Ubuntu)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clone and setup
git clone https://github.com/yourusername/sahabat-ilmu.git
cd sahabat-ilmu
npm install
npm run build

# Setup PM2
npm install -g pm2
pm2 start npm --name "sahabat-ilmu" -- start
pm2 save
pm2 startup

# Setup Nginx reverse proxy
# ... (configure Nginx)
```

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] Authentication system
- [x] Admin dashboard
- [x] Kajian CRUD
- [x] AI chat assistant
- [x] File upload

### Phase 2: Enhanced Features 🚧
- [ ] Comment system untuk kajian
- [ ] Full CRUD admin UI for kajian management
- [ ] AI chat upgrade (context-aware memory)
- [ ] Search functionality dengan filters
- [ ] Bookmark/favorite system

### Phase 3: Advanced Features 📋
- [ ] Analytics dashboard
- [ ] Role-based access control (Admin/Editor/Viewer)
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Advanced SEO optimization

### Phase 4: Scale & Optimize 🎯
- [ ] Rate limiting & API throttling
- [ ] Response caching (Redis)
- [ ] CDN integration
- [ ] Performance monitoring
- [ ] A/B testing framework

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make changes**
- Write clean, typed code
- Follow existing code style
- Add tests if applicable

4. **Commit changes**
```bash
git commit -m "feat: add amazing feature"
```

5. **Push to branch**
```bash
git push origin feature/amazing-feature
```

6. **Open Pull Request**

### Code Style Guidelines
- Use TypeScript for all new files
- Follow ESLint configuration
- Use meaningful variable/function names
- Add JSDoc comments for functions
- Keep functions small and focused

### Commit Message Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Build/config updates

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Lead Developer** - [Your Name](https://github.com/yourusername)
- **UI/UX Designer** - [Designer Name](https://github.com/designer)
- **AI Engineer** - [AI Engineer Name](https://github.com/aiengineer)

---

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org) - Amazing React framework
- [Drizzle Team](https://orm.drizzle.team) - Excellent ORM
- [NextAuth Team](https://next-auth.js.org) - Auth made easy
- [Google AI](https://ai.google.dev) - Gemini API
- [UploadThing](https://uploadthing.com) - File upload service
- Open Source Community ❤️

---

## 🐛 Known Issues

1. **Middleware Deprecation**: Next.js 16 middleware needs migration to proxy router
2. **File Upload Limits**: Current limit is 4MB per file
3. **AI Context Window**: Limited to recent conversation history

For bug reports, please [open an issue](https://github.com/yourusername/sahabat-ilmu/issues).

---

## 📞 Support

- **Email**: support@sahabatilmu.com
- **Discord**: [Join our server](https://discord.gg/sahabatilmu)
- **Documentation**: [docs.sahabatilmu.com](https://docs.sahabatilmu.com)
- **Forum**: [forum.sahabatilmu.com](https://forum.sahabatilmu.com)

---

## 🔗 Links

- **Website**: [sahabatilmu.com](https://sahabatilmu.com)
- **API Docs**: [api.sahabatilmu.com/docs](https://api.sahabatilmu.com/docs)
- **Blog**: [blog.sahabatilmu.com](https://blog.sahabatilmu.com)
- **Status Page**: [status.sahabatilmu.com](https://status.sahabatilmu.com)

---

<div align="center">

**Built with ❤️ by the Sahabat Ilmu Team**

[![Twitter Follow](https://img.shields.io/twitter/follow/sahabatilmu?style=social)](https://twitter.com/sahabatilmu)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/sahabat-ilmu?style=social)](https://github.com/yourusername/sahabat-ilmu)

[⬆ Back to top](#-sahabat-ilmu---enterprise-ai-knowledge-platform)

</div>