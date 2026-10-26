import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../../lib/supabase'
import { Spinner, btnOutline, btnPrimary, inputCls, labelCls } from './ui'

interface ShellContext {
  session: any
  notify: (msg: string) => void
}

const Ctx = createContext<ShellContext>({ session: null, notify: () => {} })

export function useAdminShell() {
  return useContext(Ctx)
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    if (!supabaseConfigured) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  function notify(msg: string) {
    setSavedMsg(msg)
    setTimeout(() => setSavedMsg(''), 3000)
  }

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen grid place-items-center p-8 text-center text-neutral-600">
        Supabase belum dikonfigurasi. Isi file <code className="font-mono text-neutral-900">.env</code> terlebih dahulu
        (lihat README).
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="flex flex-col items-center gap-3 text-neutral-500">
          <Spinner />
          <p className="font-mono text-xs uppercase tracking-wider animate-pulse">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center bg-neutral-50 px-4">
        <form onSubmit={login} className="w-full max-w-sm space-y-4 rounded-xl border border-neutral-200 bg-white p-8 shadow-xs">
          <div>
            <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-neutral-400">Admin</span>
            <h1 className="font-display text-2xl font-bold text-neutral-900">Login Panel</h1>
          </div>
          <label className="block">
            <span className={labelCls}>Email</span>
            <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="block">
            <span className={labelCls}>Password</span>
            <input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className={`${btnPrimary} w-full justify-center`}>Masuk</button>
          <p className="text-xs text-neutral-400">
            Lupa password? Atur ulang di Supabase Dashboard → Authentication → Users.
          </p>
        </form>
      </div>
    )
  }

  const tabCls = (isActive: boolean) =>
    `rounded px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
      isActive ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
    }`

  return (
    <Ctx.Provider value={{ session, notify }}>
      <div className="min-h-screen bg-neutral-50">
        <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-4">
              <span className="font-display text-lg font-bold text-neutral-900">Admin Panel</span>
              <nav className="flex gap-1">
                <NavLink to="/admin" end className={({ isActive }) => tabCls(isActive)}>
                  Konten
                </NavLink>
                <NavLink to="/admin/cv" className={({ isActive }) => tabCls(isActive)}>
                  Halaman CV
                </NavLink>
              </nav>
            </div>
            <button onClick={logout} className={btnOutline}>
              Keluar
            </button>
          </div>
          {savedMsg && (
            <div className="border-t border-emerald-200 bg-emerald-50 px-4 py-2 text-center text-sm text-emerald-700">
              ✓ {savedMsg}
            </div>
          )}
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </Ctx.Provider>
  )
}
