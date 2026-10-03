# Portfolio

Web portofolio pribadi yang dibangun dengan **React + TypeScript + Vite**, distyling menggunakan **Tailwind CSS**, backend **Supabase** (database + autentikasi + penyimpanan foto), dan siap di-deploy ke **Vercel**.

## Fitur

### Halaman Utama (`/`)
- Bagian **Profil**: foto profil berbentuk lingkaran, nama, title dengan animasi mengetik, dan bio
- **Technical Skills**: daftar skill dalam bentuk kartu
- **Experience**: riwayat pengalaman kerja dalam tampilan timeline
- **Education**: riwayat pendidikan
- **Certifications**: daftar sertifikat
- **Projects**: daftar project dengan tech stack dan link demo/repo
- Ikon link sosial media (GitHub, LinkedIn, GitLab, Twitter/X, Instagram, YouTube, Website, Email)
- Footer dengan tahun otomatis (realtime)
- Tampilan responsif untuk semua perangkat (HP, tablet, desktop)

### Halaman Admin (`/admin`)
- Login aman menggunakan email & password (Supabase Authentication)
- Kelola data diri & foto profil (upload foto ke Supabase Storage)
- Kelola link sosial media
- Tambah, edit, dan hapus skill, project, experience, education, dan certifications
- Hanya user yang terautentikasi yang bisa mengubah data (Row Level Security aktif)
- Pengunjung hanya bisa membaca data (read-only)

## Teknologi

| Teknologi | Kegunaan |
|---|---|
| React + TypeScript | UI & type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| Supabase | Database, autentikasi, file storage |
| React Router | Routing halaman |
| Vercel | Hosting & deployment |

## Struktur Project

```
src/
├── lib/supabase.ts   # Koneksi Supabase
├── pages/
│   ├── Home.tsx      # Halaman portofolio (publik)
│   └── Admin.tsx     # Halaman admin (login + kelola konten)
├── App.tsx           # Router
└── types.ts          # Tipe data
supabase/
└── schema.sql        # Skema tabel & policy
```

## Setup

1. Install dependency:
   ```bash
   npm install
   ```

2. Buat project di [Supabase](https://supabase.com), lalu jalankan SQL di file `supabase/schema.sql` pada SQL Editor.

3. Buat user admin di Supabase: **Authentication → Users → Add user** (email + password, centang Auto Confirm User).

4. Salin `.env.example` menjadi `.env` dan isi dengan URL & publishable key dari Supabase (Project Settings → API).

5. Jalankan lokal:
   ```bash
   npm run dev
   ```
   - Halaman utama: `http://localhost:5173/`
   - Admin: `http://localhost:5173/admin`

## Deploy ke Vercel

1. Push project ini ke GitHub.
2. Import repo di [vercel.com](https://vercel.com).
3. Tambahkan environment variables `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di Vercel.
4. Deploy.
