import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabase'
import type { Certification, CvContent, Education, Experience, Project } from '../../types'
import Rirekisho from '../cv/Rerikisho'

type Lang = 'id' | 'en' | 'ja'

const NAME = 'Ahmad Sunhadi Kamil'
const ROLE = 'Technical Project Manager | Full Stack Developer'
const DEFAULT_CONTACT = {
  email: 'ahmadsunhadikamil65@gmail.com',
  phone: '085756373129',
  linkedin: 'https://www.linkedin.com/in/ahmad-sunhadi-k-47a048397',
  website: 'https://ahmadsunhadikamil.vercel.app',
}

const defaultProjects = [
  {
    key: 'skmui',
    name: 'SKMUI Platform Les Online',
    desc: 'Kontribusi UI dan pengembangan beberapa halaman pada platform les online berbasis web.',
  },
  {
    key: 'alc',
    name: 'ALC Mazda - Stechoq Robotika Indonesia',
    desc: 'Sistem internal ALC Mazda yang sedang dikembangkan di Stechoq Robotika Indonesia (Yogyakarta) untuk manajemen operasional dan alur kerja perusahaan.',
  },
  {
    key: 'noora',
    name: 'Noora - Quran Web App',
    desc: 'Prototipe front-end dashboard Noora Quran, platform belajar Al-Qur’an daring: ringkasan program, status pendaftaran, modul materi, daftar PR/ujian dengan pencarian dan filter tanggal, serta FAQ.',
  },
]

const matrixValues = [
  'JavaScript, PHP, Python, Kotlin, Dart',
  'Vue.js, Nuxt.js, Tailwind CSS, HTML, CSS',
  'Flutter, Android (Kotlin)',
  'Express.js, gRPC, Laravel, Prisma',
  'PostgreSQL, MySQL, Firebase, Docker',
  'REST API, Git/GitLab, Cisco Packet Tracer, QA Testing, UI/UX Design',
]

interface CVLabels {
  eyebrow: string
  title: string
  print: string
  docTitle: string
  back: string
  loc: string
  exp: string
  summary: string
  sections: {
    summary: string
    skills: string
    work: string
    education: string
    projects: string
    certifications: string
    skillsExtra: string
    values: string
  }
  hardLabel: string
  softLabel: string
  matrixLabels: string[]
  jobs: { company: string; location: string; period: string; title: string; desc: string }[]
  education: { company: string; location: string; period: string; title: string }[]
  certifications: { title: string; issuer: string; year: string }[]
  skillSets: { hard: string; soft: string }
  strengths: string[]
  impacts: Record<string, string>
}

// Konten bawaan (fallback saat Supabase belum terisi / belum dimigrasi)
const content: Record<Lang, CVLabels> = {
  id: {
    eyebrow: 'Resume',
    title: 'Resume Online',
    print: 'Unduh Resume',
    docTitle: 'CV (Bahasa Indonesia)',
    back: 'Kembali',
    loc: 'Indonesia',
    exp: 'Kurang dari 1 Tahun Pengalaman',
    summary:
      'Mahasiswa Manajemen Informatika Politeknik Negeri Malang yang berdedikasi dan adaptif, dengan fondasi kuat pada seluruh siklus pengembangan produk digital, mulai dari analisis sistem dan desain UI/UX hingga administrasi basis data. Berpengalaman langsung dalam pengembangan web dan penjaminan kualitas perangkat lunak (QA). Sangat termotivasi untuk terus belajar dan siap berkontribusi secara profesional sebagai Web Developer, Back-End Developer, atau Full-Stack Developer.',
    sections: {
      summary: 'Ringkasan Profesional',
      skills: 'Matriks Keahlian Teknis',
      work: 'Pengalaman Kerja Profesional',
      education: 'Pendidikan',
      projects: 'Kontribusi Proyek Utama',
      certifications: 'Sertifikasi',
      skillsExtra: 'Keahlian Tambahan',
      values: 'Nilai Inti & Kekuatan Metodologis',
    },
    hardLabel: 'Keahlian Teknis',
    softLabel: 'Keahlian Non-Teknis',
    matrixLabels: [
      'Bahasa Pemrograman',
      'Frontend / Web',
      'Pengembangan Mobile',
      'Framework Backend',
      'Database & DevOps',
      'Tools & Alur Kerja',
    ],
    jobs: [
      {
        company: 'PT. Stechoq Robotika Indonesia',
        location: 'Yogyakarta, Indonesia',
        period: 'Aug 2026 – Sekarang',
        title: 'Full Stack Developer',
        desc: 'Membangun aplikasi web end-to-end untuk sistem pemantauan dan manajemen industri secara real-time, mencakup arsitektur frontend dan backend. Membuat antarmuka pengguna yang responsif dan berperforma tinggi menggunakan Nuxt.js, dengan optimalisasi visualisasi data real-time dan interaksi pengguna yang lancar. Merancang dan mengimplementasikan layanan gRPC serta microservices dengan Express.js untuk menjalankan modul operasional inti, termasuk perencanaan lini perakitan dan diagnostik sistem. Mengelola basis data relasional PostgreSQL, meliputi perancangan skema, penanganan migrasi, dan eksekusi data seed. Melakukan penelusuran (tracing) dan debugging layanan secara end-to-end untuk mendiagnosis hambatan performa serta memastikan aliran data yang mulus dan andal di seluruh stack.',
      },
      {
        company: 'CV. Visual Code Indonesia',
        location: 'Kediri, Indonesia',
        period: 'Jun 2026 – Aug 2026',
        title: 'Web Tester (QA) & UI/UX Designer — Internship',
        desc: 'Melaksanakan pengujian fungsional dan performa yang menyeluruh pada aplikasi web untuk mengidentifikasi dan menangani bug sebelum sistem dirilis. Merancang alur kerja UI/UX yang intuitif dan responsif untuk meningkatkan keterlibatan pengguna dan daya tarik visual. Menyusun laporan pengujian teknis yang terstruktur dan mengelola langkah replikasi bug guna mempercepat proses perbaikan/patch oleh tim pengembang.',
      },
    ],
    education: [
      {
        company: 'Politeknik Negeri Malang',
        location: 'Kediri',
        period: 'Jul 2024 – Sekarang',
        title: 'Diploma 3 Manajemen Informatika',
      },
      {
        company: 'MAN 3 Tangerang',
        location: 'Tangerang',
        period: 'Jun 2021 – Jun 2024',
        title: 'Matematika & Ilmu Pengetahuan Alam',
      },
    ],
    certifications: [
      { title: 'Front-End Web', issuer: 'Dicoding', year: '2024' },
      { title: 'Back-End Web dengan JavaScript', issuer: 'Dicoding', year: '2025' },
      { title: 'Pemrograman JavaScript', issuer: 'Dicoding', year: '2025' },
      { title: 'Dasar AI', issuer: 'Dicoding', year: '2025' },
      { title: 'Dasar Cloud dan Gen AI di AWS', issuer: 'Dicoding', year: '2025' },
      { title: 'Python Essentials', issuer: 'Cisco Networking Academy – Politeknik Negeri Malang', year: '2025' },
    ],
    skillSets: {
      hard: 'Microsoft Office (Excel, Word, PowerPoint), Spreadsheet, Canva',
      soft: 'Manajemen waktu, Komunikasi yang baik, Kerja sama tim, Disiplin, Bahasa Indonesia & Inggris',
    },
    strengths: [
      'Full-Stack Delivery: Membangun aplikasi dari antarmuka Nuxt.js/Vue hingga layanan backend dan database',
      'Backend Architecture: Microservices Express.js, layanan gRPC, dan perancangan skema PostgreSQL',
      'QA Mindset: Pengujian fungsional dan performa, serta laporan replikasi bug yang terstruktur',
      'UI/UX Sense: Alur kerja yang intuitif, responsif, dan konsisten secara visual',
      'Team Discipline: Manajemen waktu, komunikasi yang baik, dan kerja sama tim lintas fungsi',
    ],
    impacts: {
      skmui: 'Informasi dan layanan les tersedia secara daring',
      alc: 'Pemantauan dan manajemen lini produksi real-time dalam satu sistem terpadu',
      noora: 'Progres program, materi, dan PR terpantau dalam satu dashboard',
    },
  },
  en: {
    eyebrow: 'Resume',
    title: 'Online Resume',
    print: 'Download Resume',
    docTitle: 'Resume (English)',
    back: 'Back',
    loc: 'Indonesia',
    exp: 'Less than 1 Year Experience',
    summary:
      'A dedicated and adaptable Information Management student at Politeknik Negeri Malang with a strong foundation across the entire digital product development lifecycle, from system analysis and UI/UX design to database administration. Hands-on experience in web development and software quality assurance (QA). Highly motivated to keep learning and ready to contribute professionally as a Web Developer, Back-End Developer, or Full-Stack Developer.',
    sections: {
      summary: 'Professional Summary',
      skills: 'Technical Skills Matrix',
      work: 'Professional Work Experience',
      education: 'Education',
      projects: 'Primary Project Contributions',
      certifications: 'Certifications',
      skillsExtra: 'Additional Skills',
      values: 'Core Values & Methodological Strengths',
    },
    hardLabel: 'Hard Skills',
    softLabel: 'Soft Skills',
    matrixLabels: [
      'Languages',
      'Frontend / Web',
      'Mobile Development',
      'Backend Frameworks',
      'Database & DevOps',
      'Tools & Workflows',
    ],
    jobs: [
      {
        company: 'PT. Stechoq Robotika Indonesia',
        location: 'Yogyakarta, Indonesia',
        period: 'Aug 2026 – Present',
        title: 'Full Stack Developer',
        desc: 'Built an end-to-end web application for real-time industrial monitoring and management, covering frontend and backend architecture. Created a responsive, high-performance user interface with Vue.js, optimizing real-time data visualization and smooth user interaction. Designed and implemented gRPC services and Express.js microservices to run core operational modules, including assembly line planning and system diagnostics. Managed the PostgreSQL relational database, including schema design, migrations, and seed data execution. Traced and debugged services end-to-end to diagnose performance bottlenecks and keep data flowing smoothly and reliably across the stack.',
      },
      {
        company: 'CV. Visual Code Indonesia',
        location: 'Kediri, Indonesia',
        period: 'Jun 2026 – Aug 2026',
        title: 'Web Tester (QA) & UI/UX Designer — Internship',
        desc: 'Ran thorough functional and performance testing on web applications to find and handle bugs before release. Designed intuitive, responsive UI/UX workflows to improve user engagement and visual appeal. Wrote structured technical test reports and managed bug reproduction steps to speed up fixes and patches by the development team.',
      },
    ],
    education: [
      {
        company: 'Politeknik Negeri Malang',
        location: 'Kediri, Indonesia',
        period: 'Jul 2024 – Present',
        title: 'D3 Information Management',
      },
      {
        company: 'MAN 3 Tangerang',
        location: 'Tangerang, Indonesia',
        period: 'Jun 2021 – Jun 2024',
        title: 'Mathematics & Natural Sciences',
      },
    ],
    certifications: [
      { title: 'Front-End Web', issuer: 'Dicoding', year: '2024' },
      { title: 'Back-End Web with JavaScript', issuer: 'Dicoding', year: '2025' },
      { title: 'JavaScript Programming', issuer: 'Dicoding', year: '2025' },
      { title: 'AI Fundamentals', issuer: 'Dicoding', year: '2025' },
      { title: 'Cloud and Gen AI Fundamentals on AWS', issuer: 'Dicoding', year: '2025' },
      { title: 'Python Essentials', issuer: 'Cisco Networking Academy – Politeknik Negeri Malang', year: '2025' },
    ],
    skillSets: {
      hard: 'Microsoft Office (Excel, Word, PowerPoint), Spreadsheet, Canva',
      soft: 'Time management, Clear communication, Teamwork, Discipline, Indonesian & English',
    },
    strengths: [
      'Full-Stack Delivery: Building applications from Vue.js interfaces to backend services and databases',
      'Backend Architecture: Express.js microservices, gRPC services, and PostgreSQL schema design',
      'QA Mindset: Functional and performance testing, with structured bug reproduction reports',
      'UI/UX Sense: Intuitive, responsive, and visually consistent workflows',
      'Team Discipline: Time management, clear communication, and cross-functional teamwork',
    ],
    impacts: {
      skmui: 'Tutoring information and services available online',
      alc: 'Real-time production line monitoring and management in one unified system',
      noora: 'Program progress, materials, and homework tracked in one dashboard',
    },
  },
  ja: {
    eyebrow: '履歴書',
    title: 'オンライン履歴書',
    print: '履歴書をダウンロード',
    docTitle: '履歴書（日本語）',
    back: '戻る',
    loc: 'インドネシア',
    exp: '経験1年未満',
    summary:
      'ポリテクニック・ネグリ・マラン情報管理学科に在籍する、意欲的で適応力のある学生です。システム分析やUI/UXデザインからデータベース管理まで、デジタルプロダクト開発の全工程にわたる確かな基礎を持ち、Web開発とソフトウェア品質保証（QA）の実務経験があります。学び続ける意欲が高く、Webデベロッパー、バックエンドデベロッパー、フルスタックデベロッパーとして貢献する準備ができています。',
    sections: {
      summary: '職務要約',
      skills: '技術スキル',
      work: '職務経歴',
      education: '学歴',
      projects: '主なプロジェクト実績',
      certifications: '資格',
      skillsExtra: 'その他のスキル',
      values: '価値観と強み',
    },
    hardLabel: 'ハードスキル',
    softLabel: 'ソフトスキル',
    matrixLabels: [
      '言語',
      'フロントエンド / Web',
      'モバイル開発',
      'バックエンドフレームワーク',
      'データベース & DevOps',
      'ツール & ワークフロー',
    ],
    jobs: [
      {
        company: 'PT. Stechoq Robotika Indonesia',
        location: 'Yogyakarta, Indonesia',
        period: '2026年8月 – 現在',
        title: 'フルスタックデベロッパー',
        desc: 'リアルタイムの産業モニタリング・管理システム向けに、フロントエンドとバックエンドのアーキテクチャを含むエンドツーエンドのWebアプリケーションを構築。Vue.jsでレスポンシブかつ高性能なUIを作成し、リアルタイムデータの可視化とスムーズなユーザー操作を最適化。組立ラインの計画やシステム診断など中核の業務モジュールを動かすため、gRPCサービスとExpress.jsによるマイクロサービスを設計・実装。スキーマ設計、マイグレーション、シードデータの実行を含め、PostgreSQLを管理。サービスをエンドツーエンドでトレースしてデバッグし、パフォーマンスのボトルネックを診断して、スタック全体で円滑かつ信頼性の高いデータフローを確保。',
      },
      {
        company: 'CV. Visual Code Indonesia',
        location: 'Kediri, Indonesia',
        period: '2026年6月 – 2026年8月',
        title: 'Webテスター（QA）& UI/UXデザイナー（インターン）',
        desc: 'リリース前にバグを特定・対応するため、Webアプリケーションの機能テストとパフォーマンステストを網羅的に実施。ユーザーの関与度と視覚的な魅力を高めるため、直感的でレスポンシブなUI/UXワークフローを設計。開発チームの修正・パッチ対応を早めるため、構造化された技術テストレポートを作成し、バグ再現手順を管理。',
      },
    ],
    education: [
      {
        company: 'ポリテクニック・ネグリ・マラン',
        location: 'クディリ、インドネシア',
        period: '2024年7月 – 現在',
        title: '情報管理学ディプロマ3',
      },
      {
        company: 'MAN 3 タンゲラン',
        location: 'タンゲラン、インドネシア',
        period: '2021年6月 – 2024年6月',
        title: '数学・自然科学',
      },
    ],
    certifications: [
      { title: 'フロントエンドWeb', issuer: 'Dicoding', year: '2024' },
      { title: 'JavaScriptによるバックエンドWeb', issuer: 'Dicoding', year: '2025' },
      { title: 'JavaScriptプログラミング', issuer: 'Dicoding', year: '2025' },
      { title: 'AIの基礎', issuer: 'Dicoding', year: '2025' },
      { title: 'AWSクラウドと生成AIの基礎', issuer: 'Dicoding', year: '2025' },
      { title: 'Python Essentials', issuer: 'Cisco Networking Academy – ポリテクニック・ネグリ・マラン', year: '2025' },
    ],
    skillSets: {
      hard: 'Microsoft Office（Excel・Word・PowerPoint）, 表計算, Canva',
      soft: '時間管理, 円滑なコミュニケーション, チームワーク, 規律, インドネシア語・英語',
    },
    strengths: [
      'フルスタック開発: Vue.jsのインターフェースからバックエンドサービスとデータベースまで、アプリケーションを構築',
      'バックエンド設計: Express.jsのマイクロサービス、gRPCサービス、PostgreSQLのスキーマ設計',
      'QAマインドセット: 機能テストとパフォーマンステスト、構造化されたバグ再現レポート',
      'UI/UXセンス: 直感的でレスポンシブ、視覚的に一貫したワークフロー',
      'チーム規律: 時間管理、円滑なコミュニケーション、部門横断のチームワーク',
    ],
    impacts: {
      skmui: '家庭教師情報とサービスをオンラインで提供',
      alc: '生産ラインのリアルタイム監視・管理を単一のシステムに統合',
      noora: 'プログラムの進捗・教材・宿題を一つのダッシュボードで確認',
    },
  },
}

// Pilih teks per bahasa dari data admin (fallback ke nilai dasar)
function pick3(lang: Lang, base?: string | null, en?: string | null, ja?: string | null): string {
  if (lang === 'en' && en) return en
  if (lang === 'ja' && ja) return ja
  return base ?? ''
}

function pickLang<T extends Record<string, any>>(lang: Lang, item: T, key: string): string {
  return pick3(lang, item?.[key], item?.[`${key}_en`], item?.[`${key}_ja`])
}

// Nomor Indonesia: 085756373129 -> +62 857-5637-3129. Nomor lain dibiarkan apa adanya.
function formatPhone(raw: string): { label: string; href: string } {
  const trimmed = raw.trim()
  if (trimmed.startsWith('+') && !trimmed.startsWith('+62')) {
    return { label: trimmed, href: trimmed.replace(/[^\d+]/g, '') }
  }
  const digits = trimmed.replace(/\D/g, '')
  const local = digits.startsWith('62') ? digits.slice(2) : digits.startsWith('0') ? digits.slice(1) : digits
  if (local.length < 9 || local.length > 12) {
    return { label: trimmed, href: digits ? `+${digits}` : '' }
  }
  return {
    label: `+62 ${local.slice(0, 3)}-${local.slice(3, 7)}-${local.slice(7)}`,
    href: `+62${local}`,
  }
}

function Section({
  title,
  border = true,
  space = 'space-y-4',
  children,
}: {
  title: string
  border?: boolean
  space?: string
  children: ReactNode
}) {
  return (
    <section className={`${space} py-6 sm:py-8 ${border ? 'border-b border-neutral-100 dark:border-neutral-800' : ''}`}>
        <h3 className="break-words font-display text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      {children}
    </section>
  )
}

const iconCls = 'h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500'

export default function CV() {
  const [dark, setDark] = useState(false)
  const [lang, setLang] = useState<Lang>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('lang') : null
    return saved === 'en' || saved === 'ja' ? saved : 'id'
  })

  // Format versi Jepang: 'cv' (resume biasa) atau 'rirekisho' (履歴書)
  const [jpFormat, setJpFormat] = useState<'cv' | 'rirekisho'>('cv')

  // Data dari admin (Supabase)
  const [ready, setReady] = useState(false)
  const [cvDb, setCvDb] = useState<CvContent | null>(null)
  const [cvJobs, setCvJobs] = useState<Experience[]>([])
  const [cvEdu, setCvEdu] = useState<Education[]>([])
  const [cvCerts, setCvCerts] = useState<Certification[]>([])
  const [cvProjects, setCvProjects] = useState<Project[]>([])

  useEffect(() => {
    window.localStorage.setItem('lang', lang)
  }, [lang])

  useEffect(() => {
    if (!supabaseConfigured) { setReady(true); return }
    async function loadCv() {
      const [c, ex, ed, ce, pr] = await Promise.all([
        supabase.from('cv_content').select('*').limit(1).maybeSingle(),
        supabase.from('experiences').select('*').eq('on_cv', true).order('id'),
        supabase.from('education').select('*').eq('on_cv', true).order('id'),
        supabase.from('certifications').select('*').eq('on_cv', true).order('id'),
        supabase.from('projects').select('*').eq('on_cv', true).order('id'),
      ])
      if (c.data) setCvDb(c.data)
      setCvJobs(ex.data ?? [])
      setCvEdu(ed.data ?? [])
      setCvCerts(ce.data ?? [])
      setCvProjects(pr.data ?? [])
      setReady(true)
    }
    loadCv()
  }, [])

  const t = content[lang]
  const showRirekisho = lang === 'ja' && jpFormat === 'rirekisho'
  const docTitleVal = showRirekisho ? '履歴書' : t.docTitle

  // Gabungan data admin + konten bawaan
  const nameVal = cvDb?.name || NAME
  const roleVal = cvDb?.role || ROLE
  const emailVal = cvDb?.email || DEFAULT_CONTACT.email
  const phoneVal = cvDb?.phone || DEFAULT_CONTACT.phone
  const linkedinVal = cvDb?.linkedin || DEFAULT_CONTACT.linkedin
  const websiteVal = cvDb?.website || DEFAULT_CONTACT.website
  const urlLabel = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
  const linkedinLabel = urlLabel(linkedinVal).replace(/^linkedin\.com\//, '')
  const phone = formatPhone(phoneVal)

  // Judul dokumen mengikuti bahasa: saat "Save as PDF" nama file ikut bahasa,
  // dan atribut <html lang> menyesuaikan agar render teks & print benar
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = `${nameVal} · ${docTitleVal}`
    document.documentElement.lang = lang === 'ja' ? 'ja' : lang
    return () => {
      document.title = prevTitle
      document.documentElement.lang = prevLang
    }
  }, [lang, nameVal, docTitleVal])

  const locVal = (cvDb?.meta_location ? pick3(lang, cvDb.meta_location, cvDb.meta_location_en, cvDb.meta_location_ja) : '') || t.loc
  const expVal = (cvDb?.meta_exp ? pick3(lang, cvDb.meta_exp, cvDb.meta_exp_en, cvDb.meta_exp_ja) : '') || t.exp
  const summaryVal = (cvDb?.summary ? pick3(lang, cvDb.summary, cvDb.summary_en, cvDb.summary_ja) : '') || t.summary

  const matrixItems: { label: string; value: string }[] = cvDb?.matrix?.length
    ? cvDb.matrix.map((r) => ({
        label: pick3(lang, r.label, r.label_en, r.label_ja) || r.label,
        value: pick3(lang, r.value, r.value_en, r.value_ja) || r.value,
      }))
    : t.matrixLabels.map((label, i) => ({ label, value: matrixValues[i] }))

  const hardVal = (cvDb?.skillsets ? pick3(lang, cvDb.skillsets.hard, cvDb.skillsets.hard_en, cvDb.skillsets.hard_ja) : '') || t.skillSets.hard
  const softVal = (cvDb?.skillsets ? pick3(lang, cvDb.skillsets.soft, cvDb.skillsets.soft_en, cvDb.skillsets.soft_ja) : '') || t.skillSets.soft

  const strengthItems: string[] = cvDb?.strengths?.length
    ? cvDb.strengths.map((s) => pick3(lang, s.text, s.text_en, s.text_ja) || s.text)
    : t.strengths

  const jobItems = cvJobs.length
    ? cvJobs.map((e) => ({
        company: e.workplace,
        location: pickLang(lang, e, 'location'),
        period: e.year,
        title: pickLang(lang, e, 'position'),
        desc: pickLang(lang, e, 'description'),
      }))
    : t.jobs

  const eduItems = cvEdu.length
    ? cvEdu.map((e) => ({
        company: pickLang(lang, e, 'university'),
        location: pickLang(lang, e, 'location'),
        period: e.year,
        title: pickLang(lang, e, 'degree'),
      }))
    : t.education

  const certItems = cvCerts.length
    ? cvCerts.map((c) => ({ title: pickLang(lang, c, 'title'), issuer: pickLang(lang, c, 'issuer'), year: c.year }))
    : t.certifications

  const projectItems = cvProjects.length
    ? cvProjects.map((p) => ({
        key: String(p.id),
        name: pickLang(lang, p, 'title'),
        desc: pickLang(lang, p, 'description'),
        impact: pickLang(lang, p, 'impact'),
      }))
    : defaultProjects.map((p) => ({ key: p.key, name: p.name, desc: p.desc, impact: t.impacts[p.key] }))

  const downloadCv = () => {
    setDark(false)
    // Pastikan nama file hasil "Save as PDF" mengikuti bahasa yang dipilih
    document.title = `${nameVal} · ${docTitleVal}`
    setTimeout(() => window.print(), 150)
  }

  if (!ready) {
    return <div className="min-h-screen bg-white dark:bg-neutral-950" />
  }

  return (
    <div className={`min-h-screen bg-white dark:bg-neutral-950 ${dark ? 'dark' : ''}`}>
      <div className="mx-auto min-w-0 max-w-7xl px-3 py-6 sm:px-6 sm:py-10 md:px-12 md:py-16">
        {/* Lebar dibatasi sama untuk toolbar dan kanvas resume agar tepi kirinya sejajar */}
        <div className="mx-auto min-w-0 max-w-4xl">
          {/* Top bar */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 pb-5 sm:mb-10 sm:items-center sm:gap-4 sm:pb-6 print:hidden dark:border-neutral-800">
            <h1 className="w-full min-w-0 break-words font-display text-xl font-bold uppercase leading-none text-neutral-900 sm:w-auto sm:text-2xl dark:text-neutral-50">
              {t.title}
            </h1>
            <div className="flex w-full min-w-0 flex-wrap items-center gap-1.5 sm:w-auto sm:gap-3">
              {/* Pilihan bahasa */}
              <div className="flex h-9 divide-x divide-neutral-200 border border-neutral-200 sm:h-10 dark:divide-neutral-700 dark:border-neutral-700">
                {(['id', 'en', 'ja'] as Lang[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    aria-pressed={lang === code}
                    className={`grid h-9 w-8 shrink-0 cursor-pointer place-items-center font-mono text-[10px] uppercase transition-colors sm:h-10 sm:w-10 sm:text-xs ${
                      lang === code
                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
                    }`}
                  >
                    {code === 'ja' ? 'JP' : code.toUpperCase()}
                  </button>
                ))}
              </div>
              {/* Pilihan format (hanya untuk versi Jepang) */}
              {lang === 'ja' && (
                <div className="flex h-9 divide-x divide-neutral-200 border border-neutral-200 sm:h-10 dark:divide-neutral-700 dark:border-neutral-700">
                  {([
                    { key: 'cv', label: 'CV' },
                    { key: 'rirekisho', label: '履歴書' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setJpFormat(opt.key)}
                      aria-pressed={jpFormat === opt.key}
                      className={`grid h-9 min-w-11 shrink-0 cursor-pointer place-items-center px-1.5 font-mono text-[10px] transition-colors sm:h-10 sm:min-w-14 sm:px-3 sm:text-xs ${
                        jpFormat === opt.key
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                          : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
              {/* Aksi utama: unduh */}
              <button
                onClick={downloadCv}
                className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1 whitespace-nowrap border border-neutral-900 bg-neutral-900 px-2 font-display text-[10px] font-medium tracking-wide text-white transition-all duration-300 hover:opacity-85 sm:h-10 sm:gap-2 sm:px-5 sm:text-sm dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t.print}
              </button>
              {/* Aksi sekunder: kembali */}
              <Link
                to="/"
                className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap border border-neutral-300 px-2 font-display text-[10px] font-medium tracking-wide text-neutral-900 transition-all duration-300 hover:bg-neutral-100 sm:h-10 sm:px-5 sm:text-sm dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                {t.back}
              </Link>
              <button
                onClick={() => setDark(!dark)}
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center text-neutral-500 transition-colors hover:text-neutral-900 sm:h-10 sm:w-10 dark:text-neutral-400 dark:hover:text-neutral-100"
                aria-label="Ganti mode gelap"
              >
                {dark ? (
                  <svg className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Kanvas resume */}
          {showRirekisho ? (
            <Rirekisho />
          ) : (
           <div className="min-w-0 rounded-lg border border-neutral-200 bg-white p-4 shadow-xs sm:p-8 md:p-10 lg:p-16 print:border-none print:p-0 print:shadow-none dark:border-neutral-800 dark:bg-neutral-900">
            {/* Kop */}
            <div className="flex flex-col items-start justify-between gap-5 border-b-2 border-neutral-900 pb-6 sm:gap-6 sm:pb-8 lg:flex-row lg:items-center lg:gap-10 dark:border-neutral-100">
              <div className="min-w-0 space-y-2">
                <h2 className="break-words font-display text-2xl font-bold uppercase tracking-tight text-neutral-950 sm:text-3xl md:text-4xl dark:text-white">
                  {nameVal}
                </h2>
                 <p className="break-words font-display text-base font-light tracking-wide text-neutral-600 md:text-lg dark:text-neutral-400">
                  {roleVal}
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                   <span className="flex min-w-0 items-start gap-1.5 break-words">
                    <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                     <span className="min-w-0 break-words">{locVal}</span>
                  </span>
                   <span className="flex min-w-0 items-start gap-1.5 break-words">
                    <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                     <span className="min-w-0 break-words">{expVal}</span>
                  </span>
                </div>
              </div>

              {/* Kontak kanan */}
              <div className="w-full min-w-0 space-y-2.5 border border-neutral-100 bg-neutral-50 p-3 font-mono text-xs text-neutral-500 sm:p-4 lg:w-auto lg:shrink-0 lg:border-0 lg:border-l lg:border-neutral-200 lg:bg-transparent lg:py-1 lg:pl-8 lg:pr-0 dark:border-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-400 lg:dark:border-neutral-700 lg:dark:bg-transparent">
                 <p className="flex min-w-0 items-start gap-3">
                  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                   <a href={`mailto:${emailVal}`} className="min-w-0 break-all text-neutral-800 hover:underline lg:whitespace-nowrap lg:break-normal dark:text-neutral-200">
                    {emailVal}
                  </a>
                </p>
                 <p className="flex min-w-0 items-start gap-3">
                  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                   <a href={`tel:${phone.href}`} className="min-w-0 break-all text-neutral-800 hover:underline lg:whitespace-nowrap lg:break-normal dark:text-neutral-200">
                    {phone.label}
                  </a>
                </p>
                 <p className="flex min-w-0 items-start gap-3">
                  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <a
                    href={linkedinVal}
                    target="_blank"
                    rel="noopener noreferrer"
                     className="min-w-0 break-all text-neutral-800 hover:underline lg:whitespace-nowrap lg:break-normal dark:text-neutral-200"
                  >
                    {linkedinLabel}
                  </a>
                </p>
                 <p className="flex min-w-0 items-start gap-3">
                  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <a
                    href={websiteVal}
                    target="_blank"
                    rel="noopener noreferrer"
                     className="min-w-0 break-all text-neutral-800 hover:underline lg:whitespace-nowrap lg:break-normal dark:text-neutral-200"
                  >
                    {urlLabel(websiteVal)}
                  </a>
                </p>
              </div>
            </div>

            {/* Ringkasan Profesional */}
            <Section title={t.sections.summary}>
              <p className="font-sans text-sm font-light leading-relaxed text-neutral-600 md:text-base dark:text-neutral-400">
                {summaryVal}
              </p>
            </Section>

            {/* Matriks Keahlian Teknis */}
            <Section title={t.sections.skills}>
              <div className="grid grid-cols-1 gap-x-6 sm:gap-x-12 gap-y-6 sm:grid-cols-2">
                {matrixItems.map((row, i) => (
                  <div key={`${row.label}-${i}`} className="cv-keep-together space-y-1.5">
                    <span className="block font-mono text-[10px] font-bold uppercase text-neutral-400 dark:text-neutral-500">
                      {row.label}
                    </span>
                     <p className="break-words font-sans text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Pengalaman Kerja Profesional */}
            <Section title={t.sections.work} space="space-y-6">
              <div className="space-y-8">
                {jobItems.map((job, i) => (
                  <div key={`${job.company}-${i}`} className="space-y-3">
                     <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
                       <div className="min-w-0">
                         <h4 className="break-words font-display text-base font-bold text-neutral-900 dark:text-neutral-100">
                          {job.company}
                        </h4>
                        {job.location && (
                          <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{job.location}</p>
                        )}
                      </div>
                       <span className="max-w-full break-words bg-neutral-100 px-2 py-1 font-mono text-xs font-medium uppercase text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                        {job.period}
                      </span>
                    </div>
                    <div className="space-y-4 border-l border-neutral-200 pl-4 dark:border-neutral-700">
                      <div className="cv-keep-together space-y-1">
                         <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1 font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300">
                           <span className="min-w-0 break-words">{job.title}</span>
                          <span className="font-normal text-neutral-400 dark:text-neutral-500">({job.period})</span>
                        </div>
                        {job.desc && (
                           <p className="break-words font-sans text-sm font-light leading-relaxed text-neutral-500 dark:text-neutral-400">
                            {job.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Pendidikan */}
            <Section title={t.sections.education} space="space-y-6">
              <div className="space-y-8">
                {eduItems.map((edu, i) => (
                  <div key={`${edu.company}-${i}`} className="space-y-3">
                     <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
                       <div className="min-w-0">
                         <h4 className="break-words font-display text-base font-bold text-neutral-900 dark:text-neutral-100">
                          {edu.company}
                        </h4>
                        <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{edu.location}</p>
                      </div>
                       <span className="max-w-full break-words bg-neutral-100 px-2 py-1 font-mono text-xs font-medium uppercase text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                        {edu.period}
                      </span>
                    </div>
                    <div className="border-l border-neutral-200 pl-4 dark:border-neutral-700">
                       <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1 font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300">
                         <span className="min-w-0 break-words">{edu.title}</span>
                        <span className="font-normal text-neutral-400 dark:text-neutral-500">({edu.period})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Kontribusi Proyek Utama */}
            <Section title={t.sections.projects}>
              <div className="space-y-4">
                {projectItems.map((proj) => (
                  <div key={proj.key} className="cv-keep-together grid grid-cols-1 gap-2 text-sm sm:grid-cols-12">
                    <div className="cv-project-title font-mono font-bold text-neutral-800 sm:col-span-4 dark:text-neutral-200">
                      {proj.name}
                    </div>
                    <div className="cv-project-detail space-y-1 sm:col-span-8">
                       <p className="break-words font-sans font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {proj.desc}
                      </p>
                      {proj.impact && (
                       <div className="flex items-start gap-1.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                         <span>[Impact]:</span>
                         <p className="min-w-0 break-words font-bold text-neutral-800 dark:text-neutral-200">{proj.impact}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Sertifikasi */}
            <Section title={t.sections.certifications}>
              <div className="grid grid-cols-1 gap-x-6 sm:gap-x-12 gap-y-3 sm:grid-cols-2">
                {certItems.map((cert, i) => (
                  <div key={`${cert.title}-${i}`} className="cv-keep-together flex min-w-0 items-start justify-between gap-4">
                    <div className="min-w-0">
                       <p className="break-words font-sans text-sm font-medium text-neutral-800 dark:text-neutral-200">{cert.title}</p>
                      <p className="break-words font-mono text-xs text-neutral-500 dark:text-neutral-400">{cert.issuer}</p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-neutral-400 dark:text-neutral-500">{cert.year}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Keahlian Tambahan */}
            <Section title={t.sections.skillsExtra}>
              <div className="grid grid-cols-1 gap-x-6 sm:gap-x-12 gap-y-6 sm:grid-cols-2">
                <div className="cv-keep-together space-y-1.5">
                  <span className="block font-mono text-[10px] font-bold uppercase text-neutral-400 dark:text-neutral-500">
                    {t.hardLabel}
                  </span>
                   <p className="break-words font-sans text-sm font-medium text-neutral-800 dark:text-neutral-200">{hardVal}</p>
                </div>
                <div className="cv-keep-together space-y-1.5">
                  <span className="block font-mono text-[10px] font-bold uppercase text-neutral-400 dark:text-neutral-500">
                    {t.softLabel}
                  </span>
                   <p className="break-words font-sans text-sm font-medium text-neutral-800 dark:text-neutral-200">{softVal}</p>
                </div>
              </div>
            </Section>

            {/* Nilai Inti & Kekuatan Metodologis */}
            <Section title={t.sections.values} border={false}>
              <ul className="space-y-2 font-mono text-xs uppercase text-neutral-500 dark:text-neutral-400">
                {strengthItems.map((strength, i) => {
                  const idx = strength.indexOf(':')
                  const head = idx >= 0 ? strength.slice(0, idx) : strength
                  const rest = idx >= 0 ? strength.slice(idx + 1).trim() : ''
                  return (
                    <li key={`${strength}-${i}`} className="cv-keep-together flex items-start gap-4">
                      <span className="font-bold text-neutral-950 dark:text-neutral-100">—</span>
                      <span className="min-w-0 break-words">
                        <span className="font-bold text-neutral-950 dark:text-neutral-100">{head}:</span> {rest}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Section>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
