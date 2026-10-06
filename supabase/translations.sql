-- 1) Tambah kolom terjemahan (aman dijalankan ulang)
alter table profile add column if not exists title_en text;
alter table profile add column if not exists title_ja text;
alter table profile add column if not exists bio_en text;
alter table profile add column if not exists bio_ja text;

alter table experiences add column if not exists position_en text;
alter table experiences add column if not exists position_ja text;
alter table experiences add column if not exists workplace_en text;
alter table experiences add column if not exists workplace_ja text;

alter table education add column if not exists university_en text;
alter table education add column if not exists university_ja text;
alter table education add column if not exists degree_en text;
alter table education add column if not exists degree_ja text;
alter table education add column if not exists location_en text;
alter table education add column if not exists location_ja text;

alter table projects add column if not exists title_en text;
alter table projects add column if not exists title_ja text;
alter table projects add column if not exists description_en text;
alter table projects add column if not exists description_ja text;
alter table projects add column if not exists image_url text;

alter table certifications add column if not exists issuer_logo_url text;
alter table certifications add column if not exists title_en text;
alter table certifications add column if not exists title_ja text;
alter table certifications add column if not exists issuer_en text;
alter table certifications add column if not exists issuer_ja text;
alter table certifications add column if not exists image_url text;

-- 2) Storage bucket untuk screenshot project/sertifikat
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "public read portfolio" on storage.objects for select using (bucket_id = 'portfolio');
create policy "admin upload portfolio" on storage.objects for insert with check (bucket_id = 'portfolio' and auth.role() = 'authenticated');

-- 3) Profile
update profile set
  title = 'Manajer Proyek Teknis | Pengembang Fullstack',
  title_en = 'Technical Project Manager | Fullstack Developer',
  title_ja = 'テクニカルプロジェクトマネージャー | フルスタックデベロッパー',
  bio = 'Manajer Proyek Teknis dan Pengembang Fullstack di PT Stechoq Robotika Indonesia dengan dasar kuat di Teknologi Informasi dari Universitas Muhammadiyah Purworejo. Saya menjembatani eksekusi teknis dan manajemen proyek, dengan penguasaan Python, PHP, JavaScript, Go, TypeScript, React.js, dan Node.js. Berpengalaman di front-end, full-stack engineering, dan kepemimpinan teknis, saya berkomitmen menghadirkan solusi digital yang scalable, mengoptimalkan kolaborasi tim, dan memastikan proyek terkirim dari konsep hingga selesai.',
  bio_en = 'Technical Project Manager and Fullstack Developer at PT Stechoq Robotika Indonesia with a solid foundation in Information Technology from Universitas Muhammadiyah Purworejo. I specialize in bridging technical execution and project management, leveraging a diverse tech stack including Python, PHP, JavaScript, Go, TypeScript, React.js, and Node.js. With a background spanning front-end development, full-stack engineering, and technical leadership, I am committed to delivering scalable digital solutions, optimizing cross-functional team workflows, and driving successful project delivery from concept to completion.',
  bio_ja = 'PT Stechoq Robotika Indonesiaのテクニカルプロジェクトマネージャーおよびフルスタックデベロッパー。Universitas Muhammadiyah Purworejoで情報技術を学び、Python、PHP、JavaScript、Go、TypeScript、React.js、Node.jsなどの技術スタックを活用して、技術実行とプロジェクト管理の橋渡しに取り組んでいます。フロントエンド、フルスタックエンジニアリング、技術リーダーシップの経験を活かし、スケーラブルなデジタルソリューションの提供、チームワークフローの最適化、構想から完了までのプロジェクト推進に尽力しています。'
where id = 2;

-- 4) Experience
update experiences set
  position = 'Pengembang Front End',
  position_en = 'Front End Developer',
  position_ja = 'フロントエンド開発者',
  workplace = 'Freelancer | Jakarta, Indonesia | Remote / Hybrid',
  workplace_en = 'Freelancer | Jakarta, Indonesia | Remote / Hybrid',
  workplace_ja = 'フリーランス | インドネシア・ジャカルタ | リモート / ハイブリッド'
where id = 3;

update experiences set
  position = 'Pengembang Fullstack',
  position_en = 'Fullstack Developer',
  position_ja = 'フルスタック開発者',
  workplace = 'HENNGE | Tokyo, Japan | Remote',
  workplace_en = 'HENNGE | Tokyo, Japan | Remote',
  workplace_ja = 'HENNGE | 日本・東京 | リモート'
where id = 2;

update experiences set
  position = 'Manajer Proyek Teknis',
  position_en = 'Technical Project Manager',
  position_ja = 'テクニカルプロジェクトマネージャー',
  workplace = 'PT. Stechoq Robotika Indonesia | Yogyakarta, Indonesia | Remote / Hybrid',
  workplace_en = 'PT. Stechoq Robotika Indonesia | Yogyakarta, Indonesia | Remote / Hybrid',
  workplace_ja = 'PT. Stechoq Robotika Indonesia | インドネシア・ジョグジャカルタ | リモート / ハイブリッド'
where id = 1;

-- 5) Education
update education set
  university = 'Universitas Muhammadiyah Purworejo',
  university_en = 'Universitas Muhammadiyah Purworejo',
  university_ja = 'ムハマディヤ・プルウォレジョ大学',
  degree = 'Teknologi Informasi',
  degree_en = 'Information Technology',
  degree_ja = '情報技術',
  location = 'Kabupaten Purworejo, Jawa Tengah',
  location_en = 'Purworejo Regency, Central Java',
  location_ja = '中部ジャワ州プルウォレジョ県'
where id = 1;

-- 6) Certifications
update certifications set
  title = 'Dasar Cloud dan Gen AI AWS',
  title_en = 'AWS Cloud and Gen AI Fundamentals',
  title_ja = 'AWS クラウドと生成AI基礎',
  issuer_en = 'Dicoding',
  issuer_ja = 'Dicoding'
where id = 3;

update certifications set
  title = 'Spec-Driven Development dengan Kiro',
  title_en = 'Spec-Driven Development with Kiro',
  title_ja = 'Kiroによる仕様駆動開発',
  issuer_en = 'Dicoding',
  issuer_ja = 'Dicoding'
where id = 4;

update certifications set
  title = 'Google Analytics',
  title_en = 'Google Analytics',
  title_ja = 'Google Analytics',
  issuer_en = 'Google',
  issuer_ja = 'Google'
where id = 5;

update certifications set
  title = 'Pengembang Frontend (React)',
  title_en = 'Frontend Developer (React)',
  title_ja = 'フロントエンド開発者（React）',
  issuer_en = 'HackerRank',
  issuer_ja = 'HackerRank'
where id = 6;

update certifications set
  title = 'Insinyur Perangkat Lunak',
  title_en = 'Software Engineer',
  title_ja = 'ソフトウェアエンジニア',
  issuer_en = 'HackerRank',
  issuer_ja = 'HackerRank'
where id = 7;

update certifications set
  title = 'SQL (Intermediate)',
  title_en = 'SQL (Intermediate)',
  title_ja = 'SQL（中級）',
  issuer_en = 'HackerRank',
  issuer_ja = 'HackerRank'
where id = 8;

update certifications set
  title = 'Rest API (Intermediate)',
  title_en = 'Rest API (Intermediate)',
  title_ja = 'REST API（中級）',
  issuer_en = 'HackerRank',
  issuer_ja = 'HackerRank'
where id = 1;

update certifications set
  title = 'Pengembangan Fullstack',
  title_en = 'FullStack Development',
  title_ja = 'フルスタック開発',
  issuer_en = 'Digital Talent Academy',
  issuer_ja = 'デジタル人材アカデミー'
where id = 2;

-- 6) Projects
update projects set
  title = 'API Peringatan Dini Longsor Jawa Tengah',
  title_en = 'Landslide Early Warning API Central Java',
  title_ja = '中部ジャワ山崩れ早期警報API',
  description = 'Backend Go untuk memantau dan menyebarkan peringatan dini longsor di Jawa Tengah menggunakan data BMKG, analisis rule-based, serta notifikasi WhatsApp/SMS.',
  description_en = 'Go backend for monitoring and distributing landslide early warnings in Central Java using BMKG data, rule-based analysis, and WhatsApp/SMS notifications.',
  description_ja = 'BMKGデータ、ルールベース分析、WhatsApp/SMS通知を活用して中部ジャワの山崩れ早期警報を監視・配信するGoバックエンド。'
where id = 4;

update projects set
  title = 'Simulasi Container TMMIN',
  title_en = 'TMMIN Container Simulation',
  title_ja = 'TMMINコンテナ積載シミュレーション',
  description = 'Aplikasi simulasi pemuatan container untuk TMMIN dengan visualisasi 3D untuk merencanakan susunan dan kapasitas muatan, sehingga ruang container termanfaatkan optimal dan kesalahan muat berkurang.',
  description_en = 'Container loading simulation app for TMMIN with 3D visualization to plan arrangement and capacity, optimizing container space utilization and reducing loading errors.',
  description_ja = 'TMMIN向けコンテナ積載シミュレーションアプリ。3D可視化で配置と容量を計画し、コンテナ空間の活用を最適化し積載ミスを削減。'
where id = 6;

update projects set
  title = 'Clone Twitter/X - Chat Real-Time & Platform Media Sosial',
  title_en = 'Twitter/X Clone - Real-Time Chat & Social Media Platform',
  title_ja = 'Twitter/Xクローン - リアルタイムチャット＆SNSプラットフォーム',
  description = 'Aplikasi media sosial bergaya Twitter/X dengan cuitan gambar dan tautan, balasan, like, retweet, bookmark, trending hashtag, pencarian, profil pengguna, serta follow/unfollow. Dilengkapi live chat real-time berbasis WebSocket dengan indikator status online.',
  description_en = 'Twitter/X-style social media app with image and link posts, replies, likes, retweets, bookmarks, trending hashtags, search, user profiles, and follow/unfollow. Includes real-time WebSocket live chat with online status indicators.',
  description_ja = 'Twitter/X風SNSアプリ。画像・リンク投稿、返信、いいね、リツイート、ブックマーク、トレンドハッシュタグ、検索、ユーザープロフィール、フォロー/アンフォロー。WebSocketベースのリアルタイムライブチャットとオンライン表示を搭載。'
where id = 7;

update projects set
  title = 'Warehouse JMP',
  title_en = 'Warehouse JMP',
  title_ja = 'Warehouse JMP',
  description = 'Sistem manajemen gudang (WMS) untuk proses Delivery, Receiving, Devanning, dan Vanning, dengan registrasi dan pemindaian RFID di setiap modul untuk akurasi inventaris real-time.',
  description_en = 'A warehouse management system (WMS) that handles Delivery, Receiving, Devanning, and Vanning processes, with RFID registration and scanning in every module for real-time inventory accuracy.',
  description_ja = 'Delivery、Receiving、Devanning、Vanningプロセスを扱うWMS。各モジュールでRFID登録・スキャンを行い、リアルタイムな在庫精度を実現。'
where id = 5;

update projects set
  title = 'E-Surat Desa Banjurmukadan',
  title_en = 'E-Surat Banjurmukadan Village',
  title_ja = 'Banjurmukadan村デジタル文書管理',
  description = 'Website administrasi surat menyurat Desa Banjurmukadan dengan pembuatan surat otomatis, pencatatan surat masuk dan keluar, disposisi, serta tanda tangan digital resmi yang terverifikasi pemerintah.',
  description_en = 'Official correspondence administration website for Banjurmukadan Village with automatic letter generation, incoming/outgoing letter records, disposition, and government-verified digital signatures.',
  description_ja = 'Banjurmukadan村の公文書管理サイト。自動文書生成、受信・送信文書記録、回覧、政府認証済みデジタル署名を提供。'
where id = 8;

update projects set
  title = 'ELS Semarang - Platform E-commerce',
  title_en = 'ELS Semarang - E-commerce Platform',
  title_ja = 'ELS Semarang - ECプラットフォーム',
  description = 'Platform e-commerce untuk ELS Semarang. Menyediakan katalog produk, detail produk, dan panel admin untuk mengelola brands, kategori, produk, serta traffic pengunjung. Dibangun dengan Next.js App Router, autentikasi NextAuth, dan database via Prisma.',
  description_en = 'E-commerce platform for ELS Semarang. Provides product catalog, product details, and admin panel to manage brands, categories, products, and visitor traffic. Built with Next.js App Router, NextAuth authentication, and Prisma database.',
  description_ja = 'ELS Semarang向けECプラットフォーム。商品カタログ、商品詳細、ブランド・カテゴリ・商品・訪問者トラフィック管理用管理画面を提供。Next.js App Router、NextAuth、Prismaで構築。'
where id = 9;

update projects set
  title = 'Rianty Batik - Toko Batik Yogyakarta',
  title_en = 'Rianty Batik - Yogyakarta Batik Store',
  title_ja = 'Rianty Batik - ジョグジャカルタのバティック店',
  description = 'Website e-commerce toko batik Yogyakarta yang menampilkan koleksi terbaru dan produk terlaris seperti kemeja, dress, blouse, dan batik pria/wanita. Dilengkapi halaman shop, detail produk, dan keranjang belanja.',
  description_en = 'E-commerce website for a Yogyakarta batik store featuring new collections and best sellers such as shirts, dresses, blouses, and men/women batik. Includes shop page, product details, and shopping cart.',
  description_ja = 'ジョグジャカルタのバティック店ECサイト。シャツ、ドレス、ブラウス、男女バティックなど新作・人気商品を展開。ショップページ、商品詳細、カートを備える。'
where id = 10;
