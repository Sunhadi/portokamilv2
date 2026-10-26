-- Halaman CV: tabel konten + kolom pendukung (aman dijalankan ulang)
-- Jalankan sekali di Supabase SQL Editor.

-- 1) Tabel konten CV (baris tunggal)
create table if not exists cv_content (
  id bigint primary key generated always as identity,
  name text,
  role text,
  email text,
  phone text,
  linkedin text,
  website text,
  meta_location text,
  meta_location_en text,
  meta_location_ja text,
  meta_exp text,
  meta_exp_en text,
  meta_exp_ja text,
  summary text,
  summary_en text,
  summary_ja text,
  matrix jsonb,
  skillsets jsonb,
  strengths jsonb
);

-- 2) Kolom pendukung di tabel yang sudah ada
alter table experiences add column if not exists location text;
alter table experiences add column if not exists location_en text;
alter table experiences add column if not exists location_ja text;
alter table experiences add column if not exists description text;
alter table experiences add column if not exists description_en text;
alter table experiences add column if not exists description_ja text;
alter table experiences add column if not exists on_cv boolean default false;

alter table education add column if not exists on_cv boolean default false;
alter table certifications add column if not exists on_cv boolean default false;

alter table projects add column if not exists impact text;
alter table projects add column if not exists impact_en text;
alter table projects add column if not exists impact_ja text;
alter table projects add column if not exists on_cv boolean default false;

-- 3) Row Level Security
alter table cv_content enable row level security;

drop policy if exists "public read cv_content" on cv_content;
create policy "public read cv_content" on cv_content for select using (true);

drop policy if exists "admin write cv_content" on cv_content;
create policy "admin write cv_content" on cv_content for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Policy semua tabel konten (idempoten — dijalankan ulang pun aman)
do $$
declare t text;
begin
  foreach t in array array['profile','social_links','skills','projects','experiences','education','certifications'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "public read %s" on %I', t, t);
    execute format('create policy "public read %s" on %I for select using (true)', t, t);
    execute format('drop policy if exists "admin write %s" on %I', t, t);
    execute format('create policy "admin write %s" on %I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')', t, t);
  end loop;
end $$;

-- 4) Isi awal halaman CV (hanya jika cv_content masih kosong)
insert into cv_content (
  name, role, email, phone, linkedin, website,
  meta_location, meta_location_en, meta_location_ja,
  meta_exp, meta_exp_en, meta_exp_ja,
  summary, summary_en, summary_ja,
  matrix, skillsets, strengths
)
select
  'Ahmad Ubaidillah Tsani',
  'Full Stack Developer',
  'ahmadubai02@gmail.com',
  '085756373129',
  'https://www.linkedin.com/in/ahmadubai02',
  'https://ahmadubai.vercel.app',
  'Indonesia',
  'Indonesia',
  'インドネシア',
  'Kurang dari 1 Tahun Pengalaman',
  'Less than 1 Year Experience',
  '経験1年未満',
  $$Mahasiswa Manajemen Informatika Politeknik Negeri Malang yang berdedikasi dan adaptif, dengan fondasi kuat pada seluruh siklus pengembangan produk digital, mulai dari analisis sistem dan desain UI/UX hingga administrasi basis data. Berpengalaman langsung dalam pengembangan web dan penjaminan kualitas perangkat lunak (QA). Sangat termotivasi untuk terus belajar dan siap berkontribusi secara profesional sebagai Web Developer, Back-End Developer, atau Full-Stack Developer.$$,
  $$A dedicated and adaptable Information Management student at Politeknik Negeri Malang with a strong foundation across the entire digital product development lifecycle, from system analysis and UI/UX design to database administration. Hands-on experience in web development and software quality assurance (QA). Highly motivated to keep learning and ready to contribute professionally as a Web Developer, Back-End Developer, or Full-Stack Developer.$$,
  $$ポリテクニック・ネグリ・マラン情報管理学科に在籍する、意欲的で適応力のある学生です。システム分析やUI/UXデザインからデータベース管理まで、デジタルプロダクト開発の全工程にわたる確かな基礎を持ち、Web開発とソフトウェア品質保証（QA）の実務経験があります。学び続ける意欲が高く、Webデベロッパー、バックエンドデベロッパー、フルスタックデベロッパーとして貢献する準備ができています。$$,
  '[
    {"label": "Bahasa Pemrograman", "label_en": "Languages", "label_ja": "言語", "value": "JavaScript, PHP, Python, Kotlin, Dart"},
    {"label": "Frontend / Web", "label_en": "Frontend / Web", "label_ja": "フロントエンド / Web", "value": "Vue.js, Nuxt.js, Tailwind CSS, HTML, CSS"},
    {"label": "Pengembangan Mobile", "label_en": "Mobile Development", "label_ja": "モバイル開発", "value": "Flutter, Android (Kotlin)"},
    {"label": "Framework Backend", "label_en": "Backend Frameworks", "label_ja": "バックエンドフレームワーク", "value": "Express.js, gRPC, Laravel, Prisma"},
    {"label": "Database & DevOps", "label_en": "Database & DevOps", "label_ja": "データベース & DevOps", "value": "PostgreSQL, MySQL, Firebase, Docker"},
    {"label": "Tools & Alur Kerja", "label_en": "Tools & Workflows", "label_ja": "ツール & ワークフロー", "value": "REST API, Git/GitLab, Cisco Packet Tracer, QA Testing, UI/UX Design"}
  ]'::jsonb,
  '{
    "hard": "Microsoft Office (Excel, Word, PowerPoint), Spreadsheet, Canva",
    "hard_en": "Microsoft Office (Excel, Word, PowerPoint), Spreadsheet, Canva",
    "hard_ja": "Microsoft Office（Excel・Word・PowerPoint）, 表計算, Canva",
    "soft": "Manajemen waktu, Komunikasi yang baik, Kerja sama tim, Disiplin, Bahasa Indonesia & Inggris",
    "soft_en": "Time management, Clear communication, Teamwork, Discipline, Indonesian & English",
    "soft_ja": "時間管理, 円滑なコミュニケーション, チームワーク, 規律, インドネシア語・英語"
  }'::jsonb,
  '[
    {"text": "Full-Stack Delivery: Membangun aplikasi dari antarmuka Nuxt.js/Vue hingga layanan backend dan database", "text_en": "Full-Stack Delivery: Building applications from Vue.js interfaces to backend services and databases", "text_ja": "フルスタック開発: Vue.jsのインターフェースからバックエンドサービスとデータベースまで、アプリケーションを構築"},
    {"text": "Backend Architecture: Microservices Express.js, layanan gRPC, dan perancangan skema PostgreSQL", "text_en": "Backend Architecture: Express.js microservices, gRPC services, and PostgreSQL schema design", "text_ja": "バックエンド設計: Express.jsのマイクロサービス、gRPCサービス、PostgreSQLのスキーマ設計"},
    {"text": "QA Mindset: Pengujian fungsional dan performa, serta laporan replikasi bug yang terstruktur", "text_en": "QA Mindset: Functional and performance testing, with structured bug reproduction reports", "text_ja": "QAマインドセット: 機能テストとパフォーマンステスト、構造化されたバグ再現レポート"},
    {"text": "UI/UX Sense: Alur kerja yang intuitif, responsif, dan konsisten secara visual", "text_en": "UI/UX Sense: Intuitive, responsive, and visually consistent workflows", "text_ja": "UI/UXセンス: 直感的でレスポンシブ、視覚的に一貫したワークフロー"},
    {"text": "Team Discipline: Manajemen waktu, komunikasi yang baik, dan kerja sama tim lintas fungsi", "text_en": "Team Discipline: Time management, clear communication, and cross-functional teamwork", "text_ja": "チーム規律: 時間管理、円滑なコミュニケーション、部門横断のチームワーク"}
  ]'::jsonb
where not exists (select 1 from cv_content);
