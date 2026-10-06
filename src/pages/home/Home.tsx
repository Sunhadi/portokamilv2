import { useEffect, useState, type JSX } from 'react'
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
    skills: 'Technical Skills',
    experience: 'Experience',
    education: 'Education',
    certifications: 'Certifications',
    projects: 'Projects',
    liveDemo: 'Live Demo',
    repo: 'GitHub Repo',
    prev: 'Prev',
    next: 'Next',
    rights: 'All rights reserved.',
  },
  en: {
    loading: 'Loading portfolio...',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    yourName: 'Your Name',
    yourTitle: 'Web Developer',
    yourBio: 'A short description about you will appear here. Connect Supabase to edit the content.',
    skills: 'Technical Skills',
    experience: 'Experience',
    education: 'Education',
    certifications: 'Certifications',
    projects: 'Projects',
    liveDemo: 'Live Demo',
    repo: 'GitHub Repo',
    prev: 'Prev',
    next: 'Next',
    rights: 'All rights reserved.',
  },
  ja: {
    loading: 'ポートフォリオを読み込み中...',
    lightMode: 'ライトモード',
    darkMode: 'ダークモード',
    yourName: 'あなたの名前',
    yourTitle: 'Web Developer',
    yourBio: 'あなたについての短い紹介がここに表示されます。Supabaseを接続して内容を編集してください。',
    skills: '技術スキル',
    experience: '職歴',
    education: '学歴',
    certifications: '資格',
    projects: 'プロジェクト',
    liveDemo: 'ライブデモ',
    repo: 'GitHubリポジトリ',
    prev: '前へ',
    next: '次へ',
    rights: 'All rights reserved.',
  },
}

function pickText<T extends Record<string, any>>(lang: Lang, item: T | null | undefined, key: string): string {
  if (!item) return ''
  if (lang === 'en' && typeof item[`${key}_en`] === 'string' && item[`${key}_en`]) return item[`${key}_en`]
  if (lang === 'ja' && typeof item[`${key}_ja`] === 'string' && item[`${key}_ja`]) return item[`${key}_ja`]
  return item?.[key] ?? ''
}

function TypingTitle({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('')
  const [idx, setIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setIdx(0)
    setDeleting(false)
  }, [text])

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>

    if (!deleting && idx < text.length) {
      t = setTimeout(() => {
        setDisplayed(text.slice(0, idx + 1))
        setIdx(idx + 1)
      }, 90)
    } else if (!deleting && idx === text.length) {
      t = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && idx > 0) {
      t = setTimeout(() => {
        setDisplayed(text.slice(0, idx - 1))
        setIdx(idx - 1)
      }, 50)
    } else {
      setDeleting(false)
    }

    return () => clearTimeout(t)
  }, [idx, deleting, text])

  return (
    <p className="mt-3 text-xl font-bold text-teal-500">
      {displayed}
      <span className="animate-pulse">|</span>
    </p>
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
  const [langOpen, setLangOpen] = useState(false)
  const [projectPage, setProjectPage] = useState(0)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false,
  )

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
    const media = window.matchMedia('(min-width: 768px)')
    const update = () => setIsDesktop(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    setProjectPage(0)
  }, [projects])

  useEffect(() => {
    window.localStorage.setItem('lang', lang)
  }, [lang])

  const t = translations[lang]

  const projectsPerPage = 4
  const totalProjectPages = Math.max(1, Math.ceil(projects.length / projectsPerPage))
  const currentProjectPage = Math.min(projectPage, totalProjectPages - 1)
  const visibleProjects = isDesktop
    ? projects.slice(currentProjectPage * projectsPerPage, (currentProjectPage + 1) * projectsPerPage)
    : projects

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center" style={{ background: '#f4f8fb' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-teal-500 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">{t.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen text-slate-800 dark:text-slate-100 space-y-8 ${dark ? 'dark' : ''}`} style={{ background: dark ? '#0f172a' : '#f4f8fb' }}>
      <button
        onClick={() => setDark(!dark)}
        className="fixed top-4 right-4 z-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-md transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95"
        title={dark ? t.lightMode : t.darkMode}
      >
        {dark ? (
          <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        ) : (
          <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </button>

      <div className="fixed top-4 left-4 z-10 hidden gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-md sm:flex">
        {(['id', 'en', 'ja'] as Lang[]).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${lang === code ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            {code === 'ja' ? 'JP' : code.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="fixed bottom-4 right-4 z-20 flex flex-col items-end gap-3 sm:hidden">
        {langOpen && (
          <div className="flex gap-1 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 p-1 shadow-xl backdrop-blur-md language-menu">
            {(['id', 'en', 'ja'] as Lang[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => { setLang(code); setLangOpen(false) }}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 ${lang === code ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                {code === 'ja' ? 'JP' : code.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setLangOpen((open) => !open)}
          aria-label="Pilih bahasa"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-xs font-extrabold text-white shadow-xl transition-all hover:scale-105 hover:bg-teal-500 active:scale-95"
        >
          {lang === 'ja' ? 'JP' : lang.toUpperCase()}
        </button>
      </div>

      <header className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <div className="relative mx-auto mb-6 h-32 w-32">
          <div className="absolute inset-0 rounded-full bg-sky-400/30 blur-2xl animate-pulse" />
          <div className="relative h-28 w-28 mx-auto mt-2 overflow-hidden rounded-full ring-4 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800 shadow-[0_0_40px_rgba(56,189,248,0.5)] flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-white">{profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}</span>
            )}
          </div>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 px-2">{profile?.name ?? t.yourName}</h1>
        <TypingTitle text={profile ? pickText(lang, profile, 'title') : t.yourTitle} />
        <p className="mt-6 font-semibold text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto text-justify">{profile ? pickText(lang, profile, 'bio') : t.yourBio}</p>

        <div className="mt-8 flex justify-center items-center gap-6">
          {(() => {
            const socials: { url: string; label: string; icon: JSX.Element }[] = [
              { url: `mailto:${profile?.email ?? ''}`, label: 'Email', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg> },
              { url: links?.github ?? '', label: 'GitHub', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.75.4-1.25.72-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.2.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg> },
              { url: links?.linkedin ?? '', label: 'LinkedIn', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.05-1.85-3.05-1.85 0-2.14 1.45-2.14 2.95v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg> },
              { url: links?.gitlab ?? '', label: 'GitLab', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M22.65 14.39 12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.66 2.49 7.42 7.24 2.65 7.24-2.65 2.49-7.42 1.22 3.66a.84.84 0 0 1-.3.94zM12 1.31 8.6 7.26h6.8L12 1.31zM3.69 7.26 1.47 12.3 8.6 7.26H3.69zm13.71 0H15.4l7.13 5.04-2.22-5.04z"/></svg> },
              { url: links?.twitter ?? '', label: 'Twitter/X', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2h3.3l-7.2 8.3L23.5 22h-6.7l-5.2-6.9L5.8 22H2.5l7.7-8.9L.5 2h6.9l4.7 6.2L18.9 2zm-1.2 18h1.8L7.1 3.9H5.2L17.7 20z"/></svg> },
              { url: links?.instagram ?? '', label: 'Instagram', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
              { url: links?.youtube ?? '', label: 'YouTube', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/></svg> },
              { url: links?.website ?? '', label: 'Website', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
            ]
            return socials
              .filter((s) => s.url !== '' && s.url !== 'mailto:')
              .map((s) =>
                s.label === 'Email' ? (
                  <a key={s.label} href={s.url} title={s.label} className="text-slate-400 hover:text-sky-600 transition">{s.icon}</a>
                ) : (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer" title={s.label} className="text-slate-400 hover:text-sky-600 transition">{s.icon}</a>
                ),
              )
          })()}
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-slate-800 dark:text-slate-100">{t.skills}</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {skills.map((s) => (
            <span key={s.id} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2 font-medium text-slate-700 dark:text-slate-200 shadow-sm">{s.name}</span>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-slate-800 dark:text-slate-100">{t.experience}</h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 h-full w-px bg-slate-200" />
          {experiences.map((e, i) => (
            <div key={e.id} className={`relative mb-8 pl-10 md:pl-0 flex ${i % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
              <div className="w-full md:w-[45%] rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow p-5">
                <p className="text-sm font-semibold text-teal-500">{e.year}</p>
                <h3 className="mt-1 font-bold text-slate-800 dark:text-slate-100">{pickText(lang, e, 'position')}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{pickText(lang, e, 'workplace')}</p>
              </div>
              <div className="absolute left-2.5 md:left-1/2 top-6 h-3 w-3 -translate-x-1/2 rounded-full bg-teal-400 ring-4 ring-white dark:ring-slate-900" />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-slate-800 dark:text-slate-100">{t.education}</h2>
        <div className="space-y-6">
          {educations.map((e) => (
            <div key={e.id} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow p-8 text-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{pickText(lang, e, 'university')}</h3>
              <p className="mt-2 text-teal-500 font-medium">{pickText(lang, e, 'degree')}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{e.year} | {pickText(lang, e, 'location')}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-slate-800 dark:text-slate-100">{t.certifications}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c) => (
            <div key={c.id} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow p-6">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-teal-100 p-3">
                  {c.issuer_logo_url ? (
                    <img src={c.issuer_logo_url} alt={c.issuer} className="w-6 h-6 object-contain" />
                  ) : (
                    <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 2.4h3.4v3.4L20 10l-2.2 2.2v3.4h-3.4L12 18l-2.4-2.4H6.2v-3.4L4 10l2.2-2.2V4.4h3.4L12 2zm0 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
                  )}
                </div>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{c.year}</span>
              </div>
              <h3 className="mt-4 font-bold text-slate-800 dark:text-slate-100">{pickText(lang, c, 'title')}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{pickText(lang, c, 'issuer')}</p>
              {c.image_url && <img src={c.image_url} alt={pickText(lang, c, 'title')} className="mt-4 h-32 w-full rounded-lg object-cover" />}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-slate-800 dark:text-slate-100">{t.projects}</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {visibleProjects.map((p) => (
            <div key={p.id} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow p-6">
              {p.image_url && <img src={p.image_url} alt={pickText(lang, p, 'title')} className="mb-4 h-40 w-full rounded-lg object-cover" />}
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{pickText(lang, p, 'title')}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{pickText(lang, p, 'description')}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tech_stack?.split(',').map((t) => (
                  <span key={t} className="rounded-full bg-teal-50 dark:bg-teal-900/30 px-3 py-1 text-xs font-medium text-teal-600 dark:text-teal-400">{t.trim()}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-4 text-sm">
                {p.live_url && <a className="font-semibold text-teal-600 dark:text-teal-400 hover:underline" href={p.live_url} target="_blank" rel="noreferrer">{t.liveDemo}</a>}
                {p.repo_url && <a className="font-semibold text-slate-500 dark:text-slate-400 hover:underline" href={p.repo_url} target="_blank" rel="noreferrer">{t.repo}</a>}
              </div>
            </div>
          ))}
        </div>

        {isDesktop && totalProjectPages > 1 && (
          <div className="mt-8 hidden items-center justify-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => setProjectPage((page) => Math.max(0, page - 1))}
              disabled={currentProjectPage === 0}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 disabled:opacity-40"
            >
              {t.prev}
            </button>
            {Array.from({ length: totalProjectPages }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setProjectPage(index)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  currentProjectPage === index
                    ? 'bg-teal-600 text-white'
                    : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setProjectPage((page) => Math.min(totalProjectPages - 1, page + 1))}
              disabled={currentProjectPage === totalProjectPages - 1}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 disabled:opacity-40"
            >
              {t.next}
            </button>
          </div>
        )}
      </section>

      <footer className="border-t border-slate-100 dark:border-slate-800 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} {profile?.name ?? 'Ahmad Sunhadi Kamil'}. {t.rights}
      </footer>

    </div>
  )
}
