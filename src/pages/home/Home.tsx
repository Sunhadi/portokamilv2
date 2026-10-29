import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabase'
import type { Certification, Education, Experience, Profile, Project, Skill, SocialLinks } from '../../types'

type Lang = 'id' | 'en' | 'ja'

const translations: Record<Lang, Record<string, string>> = {
  id: {
    loading: 'Memuat portofolio...',
    lightMode: 'Mode terang',
    darkMode: 'Mode gelap',
    yourName: 'Nama Anda',
    yourTitle: 'Web Developer',
    yourBio: 'Deskripsi singkat tentang Anda akan tampil di sini. Hubungkan Supabase untuk mengedit konten.',
    skills: 'Keahlian',
    experience: 'Pengalaman',
    education: 'Pendidikan',
    certifications: 'Sertifikasi',
    projects: 'Proyek',
    liveDemo: 'Live Demo',
    repo: 'Repo',
    prev: 'Kembali',
    next: 'Lanjut',
    rights: 'All rights reserved.',
    statusLabel: 'Status',
    statusValue: 'Terbuka untuk peluang kerja',
    contactLabel: 'Kontak',
    socialsLabel: 'Sosial',
    workTogether: 'Mari bekerja sama',
  },
  en: {
    loading: 'Loading portfolio...',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    yourName: 'Your Name',
    yourTitle: 'Web Developer',
    yourBio: 'A short description about you will appear here. Connect Supabase to edit the content.',
    skills: 'Skills',
    experience: 'Experience',
    education: 'Education',
    certifications: 'Certifications',
    projects: 'Projects',
    liveDemo: 'Live Demo',
    repo: 'Repo',
    prev: 'Back',
    next: 'Next',
    rights: 'All rights reserved.',
    statusLabel: 'Status',
    statusValue: 'Open to opportunities',
    contactLabel: 'Contact',
    socialsLabel: 'Social',
    workTogether: "Let's work together",
  },
  ja: {
    loading: 'ポートフォリオを読み込み中...',
    lightMode: 'ライトモード',
    darkMode: 'ダークモード',
    yourName: 'あなたの名前',
    yourTitle: 'Web Developer',
    yourBio: 'あなたについての短い紹介がここに表示されます。Supabaseを接続して内容を編集してください。',
    skills: 'スキル',
    experience: '職歴',
    education: '学歴',
    certifications: '資格',
    projects: 'プロジェクト',
    liveDemo: 'ライブデモ',
    repo: 'リポジトリ',
    prev: '戻る',
    next: '次へ',
    rights: 'All rights reserved.',
    statusLabel: 'ステータス',
    statusValue: '新しい機会を探しています',
    contactLabel: '連絡先',
    socialsLabel: 'ソーシャル',
    workTogether: '一緒につくりましょう',
  },
}

function pickText<T extends Record<string, any>>(lang: Lang, item: T | null | undefined, key: string): string {
  if (!item) return ''
  if (lang === 'en' && typeof item[`${key}_en`] === 'string' && item[`${key}_en`]) return item[`${key}_en`]
  if (lang === 'ja' && typeof item[`${key}_ja`] === 'string' && item[`${key}_ja`]) return item[`${key}_ja`]
  return item?.[key] ?? ''
}

const wrap = 'mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8'
const labelCls = 'font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400'
function SectionHead({ index, title, invert = false }: { index: string; title: string; invert?: boolean }) {
  return (
    <div
      className={`mb-6 flex items-baseline gap-3 border-b pb-4 sm:mb-8 sm:gap-4 ${
        invert ? 'border-neutral-700' : 'border-neutral-200 dark:border-neutral-800'
      }`}
    >
      <span className={`font-mono text-xs ${invert ? 'text-neutral-500' : labelCls}`}>{index}</span>
      <h2
        className={`min-w-0 break-words font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl ${
          invert ? 'text-neutral-100' : 'text-neutral-950 dark:text-white'
        }`}
      >
        {title}
      </h2>
    </div>
  )
}

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [links, setLinks] = useState<SocialLinks | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [educations, setEducations] = useState<Education[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(false)
  const [lang, setLang] = useState<Lang>(() => (typeof window !== 'undefined' && ['id', 'en', 'ja'].includes(window.localStorage.getItem('lang') ?? '')) ? (window.localStorage.getItem('lang') as Lang) : 'id')
  const [projectPage, setProjectPage] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (!supabaseConfigured) { setLoading(false); return }
    async function fetchAll() {
      const [p, l, s, pr, ex, ed, c] = await Promise.all([
        supabase.from('profile').select('*').limit(1).maybeSingle(),
        supabase.from('social_links').select('*').limit(1).maybeSingle(),
        supabase.from('skills').select('*').order('id'),
        supabase.from('projects').select('*').order('id'),
        supabase.from('experiences').select('*').order('id'),
        supabase.from('education').select('*').order('id'),
        supabase.from('certifications').select('*').order('id'),
      ])
      setProfile(p.data)
      setLinks(l.data)
      setSkills(s.data ?? [])
      setProjects(pr.data ?? [])
      setExperiences(ex.data ?? [])
      setEducations(ed.data ?? [])
      setCertifications(c.data ?? [])
      setLoading(false)
    }
    fetchAll()
  }, [])

  useEffect(() => {
    window.localStorage.setItem('lang', lang)
  }, [lang])

  const t = translations[lang]

  const socialLinks: { url: string; label: string }[] = [
    { url: links?.github ?? '', label: 'GitHub' },
    { url: links?.linkedin ?? '', label: 'LinkedIn' },
    { url: links?.gitlab ?? '', label: 'GitLab' },
    { url: links?.twitter ?? '', label: 'Twitter / X' },
    { url: links?.instagram ?? '', label: 'Instagram' },
    { url: links?.youtube ?? '', label: 'YouTube' },
    { url: links?.website ?? '', label: 'Website' },
  ].filter((s) => s.url !== '')

  const projectsPerPage = 4
  const totalProjectPages = Math.max(1, Math.ceil(projects.length / projectsPerPage))
  const currentProjectPage = Math.min(projectPage, totalProjectPages - 1)
  const visibleProjects = projects.slice(currentProjectPage * projectsPerPage, (currentProjectPage + 1) * projectsPerPage)

  let secIdx = 0
  const nextSec = () => String(++secIdx).padStart(2, '0')

  if (loading) {
    return (
      <div className={`min-h-screen grid place-items-center bg-white dark:bg-neutral-950 ${dark ? 'dark' : ''}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-neutral-100 animate-spin" />
          <p className="font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 animate-pulse">{t.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-white pt-12 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 sm:pt-0 ${dark ? 'dark' : ''}`}>
      {/* Nav */}
      <nav className="fixed inset-x-0 top-0 z-30 isolate border-b border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:sticky sm:bg-white/85 sm:shadow-none sm:backdrop-blur sm:dark:bg-neutral-950/85">
        <div className={`${wrap} flex min-h-12 items-center justify-between gap-1.5 py-1.5 sm:h-14 sm:gap-3 sm:py-0`}>
          <Link to="/" className="min-w-0 flex-1 truncate font-display text-[11px] font-bold uppercase tracking-tight sm:text-base">
            {profile?.name ?? t.yourName}
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <div className="flex h-8 divide-x divide-neutral-200 border border-neutral-200 dark:divide-neutral-700 dark:border-neutral-700 sm:h-9">
              {(['id', 'en', 'ja'] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`grid w-7 place-items-center font-mono text-[10px] uppercase tracking-wider transition-colors sm:w-9 sm:text-xs ${
                    lang === code
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                      : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
                  }`}
                >
                  {code === 'ja' ? 'JP' : code.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDark(!dark)}
              title={dark ? t.lightMode : t.darkMode}
              aria-label={dark ? t.lightMode : t.darkMode}
              className="grid h-8 w-8 place-items-center border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 sm:h-9 sm:w-9"
            >
              {dark ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className={`${wrap} py-10 sm:py-16 md:py-20`}>
        <h1 className="break-words font-display text-[length:clamp(1.65rem,7vw,4.5rem)] font-bold uppercase leading-[0.9] tracking-tight">
          Ahmad Sunhadi Kamil
        </h1>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 sm:mt-5 sm:text-sm">
          <span className="mr-3 inline-block h-2 w-2 bg-neutral-900 dark:bg-neutral-100" />
          Technical Project Manager | Fullstack Developer
        </p>

        <div className="mt-8 grid gap-8 sm:mt-10 sm:gap-10 md:grid-cols-[1.6fr_1fr] md:gap-12">
          <div>
            <p className={`max-w-2xl text-sm text-neutral-500 dark:text-neutral-400 sm:text-base ${lang === 'ja' ? 'leading-[1.95]' : 'leading-relaxed'}`}>
              {profile ? pickText(lang, profile, 'bio') : t.yourBio}
            </p>
            <button
              type="button"
              onClick={() => navigate('/cv')}
              className="mt-8 inline-flex w-full cursor-pointer items-center justify-center gap-2 border border-neutral-900 px-6 py-3 font-mono text-xs uppercase tracking-wider text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white sm:w-auto dark:border-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-900"
            >
              Download CV
              <span aria-hidden>↗</span>
            </button>
          </div>

          <div className="min-w-0 self-start border-t border-neutral-100 pt-2 dark:border-neutral-800 md:border-t-0 md:border-l md:border-neutral-200 md:pt-0 md:pl-10 dark:md:border-neutral-800">
          <div className="divide-y divide-neutral-100 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0 dark:divide-neutral-800">
            {profile?.email && (
              <div className="py-5">
                <p className={labelCls}>{t.contactLabel}</p>
                <a
                  href={`mailto:${profile.email}`}
                  className="mt-1.5 block break-all text-sm hover:underline"
                >
                  {profile.email}
                </a>
              </div>
            )}
            <div className="py-5">
              <p className={labelCls}>{t.statusLabel}</p>
              <p className="mt-1.5 flex min-w-0 items-start gap-2 text-sm">
                <span className="inline-block h-2 w-2 shrink-0 bg-neutral-900 dark:bg-neutral-100" />
                <span className="min-w-0 break-words">{t.statusValue}</span>
              </p>
            </div>
            {socialLinks.length > 0 && (
              <div className="py-5">
                <p className={labelCls}>{t.socialsLabel}</p>
                <ul className="mt-1.5 grid w-full grid-cols-2 gap-x-3 gap-y-2 md:grid-cols-1 md:gap-y-1.5">
                  {socialLinks.map((s) => (
                    <li key={s.label} className="min-w-0">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex max-w-full min-w-0 items-center gap-1 break-words text-sm text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100"
                      >
                        {s.label}
                        <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            </div>
          </div>
        </div>
      </header>

      {/* 01 — Skills (grid kotak seragam) */}
      {skills.length > 0 && (
        <section className={`${wrap} border-b border-neutral-100 py-12 sm:py-16 dark:border-neutral-800`}>
          <SectionHead index={nextSec()} title={t.skills} />
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
            {skills.map((s) => (
              <li
                key={s.id}
                className="flex min-h-16 items-center justify-center border border-neutral-200 px-2 py-3 text-center font-display text-[13px] font-bold leading-snug text-neutral-800 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-700 dark:text-neutral-100 dark:hover:border-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-900 sm:min-h-[72px] sm:px-3 sm:py-4 sm:text-base"
              >
                {s.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 02 — Projects (grid seragam 2 kolom) */}
      {projects.length > 0 && (
        <section className={`${wrap} border-b border-neutral-100 py-12 sm:py-16 dark:border-neutral-800`}>
          <SectionHead index={nextSec()} title={t.projects} />
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-y-12">
            {visibleProjects.map((p) => {
              const techs = (p.tech_stack ?? '').split(',').map((s) => s.trim()).filter(Boolean)
              const desc = pickText(lang, p, 'description')
              const imgHref = p.live_url || p.repo_url || ''
              return (
                <article key={p.id} className="group flex h-full flex-col">
                  {p.image_url ? (
                    <a
                      href={imgHref || undefined}
                      target={imgHref ? '_blank' : undefined}
                      rel="noreferrer"
                      className={`block overflow-hidden border border-neutral-200 dark:border-neutral-800 ${imgHref ? 'cursor-pointer' : ''}`}
                    >
                      <img
                        src={p.image_url}
                        alt={pickText(lang, p, 'title')}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </a>
                  ) : (
                    <div
                      className="ph-stripes flex aspect-[16/10] items-center justify-center border border-neutral-200 text-neutral-300 dark:border-neutral-800 dark:text-neutral-700"
                      aria-hidden
                    />
                  )}
                  <h3 className="mt-4 break-words font-display text-lg font-bold leading-snug text-neutral-950 dark:text-white">
                    {pickText(lang, p, 'title')}
                  </h3>
                  {desc && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {desc}
                    </p>
                  )}
                  {techs.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {techs.map((tech) => (
                        <span
                          key={tech}
                          className="border border-neutral-200 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {(p.live_url || p.repo_url) && (
                    <div className="mt-auto flex gap-5 pt-5 font-mono text-xs uppercase tracking-wider">
                      {p.live_url && (
                        <a className="hover:underline" href={p.live_url} target="_blank" rel="noreferrer">
                          {t.liveDemo} ↗
                        </a>
                      )}
                      {p.repo_url && (
                        <a className="text-neutral-400 hover:text-neutral-900 hover:underline dark:hover:text-neutral-100" href={p.repo_url} target="_blank" rel="noreferrer">
                          {t.repo} ↗
                        </a>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>

          {totalProjectPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:mt-12">
              <button
                type="button"
                onClick={() => setProjectPage((page) => Math.max(0, page - 1))}
                disabled={currentProjectPage === 0}
                className="border border-neutral-200 px-3 py-2 font-mono text-xs uppercase tracking-wider text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                ← {t.prev}
              </button>
              {Array.from({ length: totalProjectPages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setProjectPage(index)}
                  className={`px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                    currentProjectPage === index
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                      : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setProjectPage((page) => Math.min(totalProjectPages - 1, page + 1))}
                disabled={currentProjectPage === totalProjectPages - 1}
                className="border border-neutral-200 px-3 py-2 font-mono text-xs uppercase tracking-wider text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                {t.next} →
              </button>
            </div>
          )}
        </section>
      )}

      {/* 03 — Experience (list editorial: tahun kiri, isi kanan) */}
      {experiences.length > 0 && (
        <section className={`${wrap} border-b border-neutral-100 py-12 sm:py-16 dark:border-neutral-800`}>
          <SectionHead index={nextSec()} title={t.experience} />
          <div>
            {experiences.map((e) => (
                <article
                key={e.id}
                className="grid gap-1 border-b border-neutral-100 py-6 last:border-b-0 sm:grid-cols-[160px_1fr] sm:gap-6 dark:border-neutral-800"
              >
                <p className="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{e.year}</p>
                <div className="min-w-0">
                  <h3 className="break-words font-display text-lg font-bold sm:text-xl">{pickText(lang, e, 'position')}</h3>
                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                    {pickText(lang, e, 'workplace')}
                    {e.location && <span> · {e.location}</span>}
                  </p>
                  {e.description && (
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {pickText(lang, e, 'description')}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 04 — Education */}
      {educations.length > 0 && (
        <section className={`${wrap} border-b border-neutral-100 py-12 sm:py-16 dark:border-neutral-800`}>
          <SectionHead index={nextSec()} title={t.education} />
          <div>
            {educations.map((e) => (
                <article
                key={e.id}
                className="grid gap-1 border-b border-neutral-100 py-6 last:border-b-0 sm:grid-cols-[160px_1fr] sm:gap-6 dark:border-neutral-800"
              >
                <p className="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{e.year}</p>
                <div className="min-w-0">
                  <h3 className="break-words font-display text-lg font-bold sm:text-xl">{pickText(lang, e, 'university')}</h3>
                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                    {pickText(lang, e, 'degree')}
                    {e.location && <span> · {e.location}</span>}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 05 — Certifications (grid ringkas) */}
      {certifications.length > 0 && (
        <section className={`${wrap} py-12 sm:py-16`}>
          <SectionHead index={nextSec()} title={t.certifications} />
          <div className="grid grid-cols-1 gap-x-5 gap-y-6 min-[400px]:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {certifications.map((c) => (
              <article key={c.id} className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <div className="flex items-center justify-between gap-2">
                  <span className={labelCls}>{c.year}</span>
                  {c.issuer_logo_url && (
                    <img src={c.issuer_logo_url} alt={c.issuer} className="h-5 w-5 object-contain opacity-80" />
                  )}
                </div>
                <h3 className="mt-2 break-words font-display text-sm font-bold leading-snug text-neutral-950 dark:text-white">
                  {pickText(lang, c, 'title')}
                </h3>
                <p className="mt-1 break-words text-xs text-neutral-500 dark:text-neutral-400">
                  {pickText(lang, c, 'issuer')}
                </p>
                {c.image_url && (
                  <a href={c.image_url} target="_blank" rel="noreferrer" className="mt-3 block">
                    <img
                      src={c.image_url}
                      alt={pickText(lang, c, 'title')}
                      className="h-20 w-full border border-neutral-200 object-cover opacity-80 transition-opacity hover:opacity-100 dark:border-neutral-800"
                    />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Footer — pernyataan besar */}
      <footer className="bg-neutral-900 text-neutral-100">
        <div className={`${wrap} py-12 sm:py-20`}>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">{t.workTogether}</p>
          {profile?.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="mt-4 block break-all font-display text-2xl font-bold leading-tight tracking-tight transition-colors hover:text-white sm:text-3xl md:text-4xl lg:text-5xl"
            >
              {profile.email}
            </a>
          ) : (
            <p className="mt-4 break-words font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
              {profile?.name ?? t.yourName}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-700 pt-6 font-mono text-[11px] uppercase tracking-wider text-neutral-500 sm:mt-12">
            <span className="break-words">© {new Date().getFullYear()} {profile?.name ?? 'Portfolio'}</span>
            <span className="break-words">{t.rights}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
