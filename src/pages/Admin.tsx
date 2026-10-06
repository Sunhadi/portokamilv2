import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import type { Certification, Education, Experience, Profile, Project, Skill, SocialLinks } from '../types'

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

const emptyProfile: Profile = { id: 0, name: '', title: '', bio: '', email: '', avatar_url: '' }
const emptyLinks: SocialLinks = { id: 0, github: '', linkedin: '', gitlab: '', twitter: '', instagram: '', youtube: '', website: '' }

export default function Admin() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [profile, setProfile] = useState<Profile>(emptyProfile)
  const [links, setLinks] = useState<SocialLinks>(emptyLinks)
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [educations, setEducations] = useState<Education[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [newCertification, setNewCertification] = useState({ title: '', issuer: '', year: '', issuer_logo_url: '', title_en: '', title_ja: '', issuer_en: '', issuer_ja: '', image_url: '' })
  const [newEducation, setNewEducation] = useState({ university: '', degree: '', year: '', location: '', degree_en: '', degree_ja: '', location_en: '', location_ja: '', university_en: '', university_ja: '' })
  const [newExperience, setNewExperience] = useState({ year: '', position: '', workplace: '', position_en: '', position_ja: '', workplace_en: '', workplace_ja: '' })
  const [newSkill, setNewSkill] = useState({ name: '', level: 80 })
  const [newProject, setNewProject] = useState({ title: '', description: '', tech_stack: '', live_url: '', repo_url: '', title_en: '', title_ja: '', description_en: '', description_ja: '', image_url: '' })
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null)
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [editingExpId, setEditingExpId] = useState<number | null>(null)
  const [editingEduId, setEditingEduId] = useState<number | null>(null)
  const [editingCertId, setEditingCertId] = useState<number | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [addingSkill, setAddingSkill] = useState(false)
  const [addingProject, setAddingProject] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
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

  useEffect(() => {
    if (session) loadAll()
  }, [session])

  async function loadAll() {
    const p = await supabase.from('profile').select('*').limit(1).maybeSingle()
    if (p.data) setProfile(p.data)
    const l = await supabase.from('social_links').select('*').limit(1).maybeSingle()
    if (l.data) setLinks(l.data)
    const s = await supabase.from('skills').select('*').order('id')
    setSkills(s.data ?? [])
    const pr = await supabase.from('projects').select('*').order('id')
    setProjects(pr.data ?? [])
    const ex = await supabase.from('experiences').select('*').order('id')
    setExperiences(ex.data ?? [])
    const ed = await supabase.from('education').select('*').order('id')
    setEducations(ed.data ?? [])
    const c = await supabase.from('certifications').select('*').order('id')
    setCertifications(c.data ?? [])
  }

  function notify(msg: string) {
    setSavedMsg(msg)
    setTimeout(() => setSavedMsg(''), 3000)
  }

  async function uploadPortfolioImage(file: File | undefined, folder: 'projects' | 'certifications', onDone: (url: string) => void) {
    if (!file) return
    setUploadingImage(true)
    const filename = `${folder}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('portfolio').upload(filename, file)
    if (error) { alert('Gagal upload gambar: ' + error.message); setUploadingImage(false); return }
    const { data } = supabase.storage.from('portfolio').getPublicUrl(filename)
    onDone(data.publicUrl)
    setUploadingImage(false)
    notify('Gambar berhasil diupload! Klik simpan untuk menyimpan.')
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

  async function saveBasic(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    const fields = { name: profile.name, title: profile.title, bio: profile.bio, email: profile.email, avatar_url: profile.avatar_url, title_en: profile.title_en, title_ja: profile.title_ja, bio_en: profile.bio_en, bio_ja: profile.bio_ja }
    const { error } = profile.id
      ? await supabase.from('profile').update(fields).eq('id', profile.id)
      : await supabase.from('profile').insert(fields)
    setSavingProfile(false)
    if (error) { alert('Gagal menyimpan: ' + error.message); return }
    notify('Data diri berhasil disimpan!')
    loadAll()
  }

  async function saveLinks(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    const fields = {
      github: links.github, linkedin: links.linkedin, gitlab: links.gitlab,
      twitter: links.twitter, instagram: links.instagram, youtube: links.youtube, website: links.website,
    }
    const { error } = links.id
      ? await supabase.from('social_links').update(fields).eq('id', links.id)
      : await supabase.from('social_links').insert(fields)
    setSavingProfile(false)
    if (error) { alert('Gagal menyimpan: ' + error.message); return }
    notify('Link sosial media berhasil disimpan!')
    loadAll()
  }

  async function addSkill(e: React.FormEvent) {
    e.preventDefault()
    setAddingSkill(true)
    const { error } = editingSkillId
      ? await supabase.from('skills').update(newSkill).eq('id', editingSkillId)
      : await supabase.from('skills').insert(newSkill)
    if (error) alert('Gagal simpan skill: ' + error.message)
    setNewSkill({ name: '', level: 80 })
    setEditingSkillId(null)
    if (!error) notify('Skill berhasil disimpan!')
    setAddingSkill(false)
    loadAll()
  }

  async function deleteSkill(id: number) {
    await supabase.from('skills').delete().eq('id', id)
    loadAll()
  }

  async function addProject(e: React.FormEvent) {
    e.preventDefault()
    setAddingProject(true)
    const { error } = editingProjectId
      ? await supabase.from('projects').update(newProject).eq('id', editingProjectId)
      : await supabase.from('projects').insert(newProject)
    if (error) alert('Gagal simpan project: ' + error.message)
    setNewProject({ title: '', description: '', tech_stack: '', live_url: '', repo_url: '', title_en: '', title_ja: '', description_en: '', description_ja: '', image_url: '' })
    setEditingProjectId(null)
    if (!error) notify('Project berhasil disimpan!')
    setAddingProject(false)
    loadAll()
  }

  async function addCertification(e: React.FormEvent) {
    e.preventDefault()
    const { error } = editingCertId
      ? await supabase.from('certifications').update(newCertification).eq('id', editingCertId)
      : await supabase.from('certifications').insert(newCertification)
    if (error) alert('Gagal simpan sertifikat: ' + error.message)
    setNewCertification({ title: '', issuer: '', year: '', issuer_logo_url: '', title_en: '', title_ja: '', issuer_en: '', issuer_ja: '', image_url: '' })
    setEditingCertId(null)
    if (!error) notify('Sertifikat berhasil disimpan!')
    loadAll()
  }

  async function deleteCertification(id: number) {
    await supabase.from('certifications').delete().eq('id', id)
    loadAll()
  }

  async function addEducation(e: React.FormEvent) {
    e.preventDefault()
    const { error } = editingEduId
      ? await supabase.from('education').update(newEducation).eq('id', editingEduId)
      : await supabase.from('education').insert(newEducation)
    if (error) alert('Gagal simpan pendidikan: ' + error.message)
    setNewEducation({ university: '', degree: '', year: '', location: '', degree_en: '', degree_ja: '', location_en: '', location_ja: '', university_en: '', university_ja: '' })
    setEditingEduId(null)
    if (!error) notify('Pendidikan berhasil disimpan!')
    loadAll()
  }

  async function deleteEducation(id: number) {
    await supabase.from('education').delete().eq('id', id)
    loadAll()
  }

  async function addExperience(e: React.FormEvent) {
    e.preventDefault()
    const { error } = editingExpId
      ? await supabase.from('experiences').update(newExperience).eq('id', editingExpId)
      : await supabase.from('experiences').insert(newExperience)
    if (error) alert('Gagal simpan pengalaman: ' + error.message)
    setNewExperience({ year: '', position: '', workplace: '', position_en: '', position_ja: '', workplace_en: '', workplace_ja: '' })
    setEditingExpId(null)
    if (!error) notify('Pengalaman berhasil disimpan!')
    loadAll()
  }

  async function deleteExperience(id: number) {
    await supabase.from('experiences').delete().eq('id', id)
    loadAll()
  }

  async function deleteProject(id: number) {
    await supabase.from('projects').delete().eq('id', id)
    loadAll()
  }

  if (!supabaseConfigured) {
    return <div className="min-h-screen grid place-items-center p-8 text-center text-slate-500">Supabase belum dikonfigurasi. Isi file <code className="text-sky-600">.env</code> terlebih dahulu (lihat README).</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Spinner />
          <p>Memuat...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <form onSubmit={login} className="w-full max-w-sm rounded-xl bg-white shadow p-8 space-y-4">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="w-full rounded bg-sky-600 py-2 font-semibold text-white hover:bg-sky-500">Masuk</button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button onClick={logout} className="rounded bg-white shadow px-4 py-2 text-sm">Keluar</button>
      </div>

      {savedMsg && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-300 px-4 py-2 text-emerald-600">
          ✓ {savedMsg}
        </div>
      )}

      {/* Data Diri */}
      <div className="rounded-xl bg-white shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Profil</h2>
        {profile.name ? (
          <div className="rounded bg-slate-100 p-4 text-sm space-y-1">
            <p><span className="text-slate-500">Nama:</span> {profile.name}</p>
            <p><span className="text-slate-500">Title:</span> {profile.title}</p>
            <p><span className="text-slate-500">Bio:</span> {profile.bio}</p>
            <p><span className="text-slate-500">Email:</span> {profile.email}</p>
            <p><span className="text-slate-500">Foto (URL):</span> {profile.avatar_url}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Belum ada data profil tersimpan.</p>
        )}
        <form onSubmit={saveBasic} className="space-y-3">
          <h3 className="font-semibold text-sky-600">Data Diri</h3>
          {([
            { key: 'name', label: 'Nama' },
            { key: 'title', label: 'Title / Pekerjaan' },
            { key: 'bio', label: 'Bio / Tentang Saya' },
            { key: 'email', label: 'Email' },
          ] as const).map(({ key, label }) => (
            <label key={key} className="block">
              <span className="mb-1 block text-sm text-slate-500">{label}</span>
              <input
                className="w-full rounded bg-slate-100 px-3 py-2"
                placeholder={label}
                value={profile[key]}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
              />
            </label>
          ))}
          <input
            className="w-full rounded bg-slate-100 px-3 py-2"
            placeholder="Title / Pekerjaan (EN)"
            value={profile.title_en ?? ''}
            onChange={(e) => setProfile({ ...profile, title_en: e.target.value })}
          />
          <input
            className="w-full rounded bg-slate-100 px-3 py-2"
            placeholder="Title / Pekerjaan (JA)"
            value={profile.title_ja ?? ''}
            onChange={(e) => setProfile({ ...profile, title_ja: e.target.value })}
          />
          <textarea
            className="w-full rounded bg-slate-100 px-3 py-2"
            placeholder="Bio / Tentang Saya (EN)"
            value={profile.bio_en ?? ''}
            onChange={(e) => setProfile({ ...profile, bio_en: e.target.value })}
          />
          <textarea
            className="w-full rounded bg-slate-100 px-3 py-2"
            placeholder="Bio / Tentang Saya (JA)"
            value={profile.bio_ja ?? ''}
            onChange={(e) => setProfile({ ...profile, bio_ja: e.target.value })}
          />
          <div className="block">
            <span className="mb-1 block text-sm text-slate-500">Foto Profil</span>
            {profile.avatar_url && <img src={profile.avatar_url} alt="Preview" className="h-16 w-16 rounded-full object-cover mb-2" />}
            <input
              type="file"
              accept="image/*"
              className="w-full rounded bg-slate-100 px-3 py-2"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setSavingProfile(true)
                const filename = `avatar-${Date.now()}-${file.name}`
                const { error } = await supabase.storage.from('avatars').upload(filename, file)
                if (error) { alert('Gagal upload foto: ' + error.message); setSavingProfile(false); return }
                const { data } = supabase.storage.from('avatars').getPublicUrl(filename)
                setProfile({ ...profile, avatar_url: data.publicUrl })
                setSavingProfile(false)
                notify('Foto berhasil diupload! Klik Simpan Data Diri untuk menyimpan.')
              }}
            />
          </div>
          <button disabled={savingProfile} className="flex items-center gap-2 rounded bg-sky-600 text-white px-4 py-2 font-semibold hover:bg-sky-500 disabled:opacity-50">
            {savingProfile && <Spinner />}
            {savingProfile ? 'Menyimpan...' : 'Simpan Data Diri'}
          </button>
        </form>
      </div>

      {/* Link Sosial Media */}
      <div className="rounded-xl bg-white shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Link Sosial Media</h2>
        {links.github || links.linkedin || links.gitlab || links.twitter || links.instagram || links.youtube || links.website ? (
          <div className="rounded bg-slate-100 p-4 text-sm space-y-1">
            <p><span className="text-slate-500">GitHub:</span> {links.github}</p>
            <p><span className="text-slate-500">LinkedIn:</span> {links.linkedin}</p>
            <p><span className="text-slate-500">GitLab:</span> {links.gitlab}</p>
            <p><span className="text-slate-500">Twitter/X:</span> {links.twitter}</p>
            <p><span className="text-slate-500">Instagram:</span> {links.instagram}</p>
            <p><span className="text-slate-500">YouTube:</span> {links.youtube}</p>
            <p><span className="text-slate-500">Website:</span> {links.website}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Belum ada link sosial media tersimpan.</p>
        )}
        <form onSubmit={saveLinks} className="space-y-3">
          {([
            { key: 'github', label: 'Link GitHub' },
            { key: 'linkedin', label: 'Link LinkedIn' },
            { key: 'gitlab', label: 'Link GitLab' },
            { key: 'twitter', label: 'Link Twitter/X' },
            { key: 'instagram', label: 'Link Instagram' },
            { key: 'youtube', label: 'Link YouTube' },
            { key: 'website', label: 'Link Website' },
          ] as const).map(({ key, label }) => (
            <label key={key} className="block">
              <span className="mb-1 block text-sm text-slate-500">{label}</span>
              <input
                className="w-full rounded bg-slate-100 px-3 py-2"
                placeholder={label}
                value={links[key]}
                onChange={(e) => setLinks({ ...links, [key]: e.target.value })}
              />
            </label>
          ))}
          <button disabled={savingProfile} className="flex items-center gap-2 rounded bg-sky-600 text-white px-4 py-2 font-semibold hover:bg-sky-500 disabled:opacity-50">
            {savingProfile && <Spinner />}
            {savingProfile ? 'Menyimpan...' : 'Simpan Link Sosial Media'}
          </button>
        </form>
      </div>

      {/* Skills */}
      <div className="rounded-xl bg-white shadow p-6 space-y-3">
        <h2 className="text-xl font-semibold">Skills</h2>
        {skills.length === 0 && <p className="text-sm text-slate-400">Belum ada skill tersimpan.</p>}
        {skills.map((s) => (
          <div key={s.id} className="flex items-center justify-between">
            <span>{s.name} — {s.level}%</span>
            <span className="flex gap-3">
              <button onClick={() => { setNewSkill({ name: s.name, level: s.level }); setEditingSkillId(s.id) }} className="text-sky-600 text-sm">Edit</button>
              <button onClick={() => deleteSkill(s.id)} className="text-red-500 text-sm">Hapus</button>
            </span>
          </div>
        ))}
        <form onSubmit={addSkill} className="flex flex-col sm:flex-row gap-2">
          <input className="flex-1 rounded bg-slate-100 px-3 py-2" placeholder="Nama skill" value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} required />
          <input className="w-24 rounded bg-slate-100 px-3 py-2" type="number" min={0} max={100} value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })} />
          <button disabled={addingSkill} className="flex items-center gap-2 rounded bg-sky-600 text-white px-4 py-2 disabled:opacity-50">
            {addingSkill && <Spinner />}
            {addingSkill ? 'Menyimpan...' : editingSkillId ? 'Simpan Perubahan' : 'Tambah'}
          </button>
        </form>
      </div>

      {/* Certifications */}
      <div className="rounded-xl bg-white shadow p-6 space-y-3">
        <h2 className="text-xl font-semibold">Certifications</h2>
        {certifications.length === 0 && <p className="text-sm text-slate-400">Belum ada sertifikat tersimpan.</p>}
        {certifications.map((c) => (
          <div key={c.id} className="flex items-center justify-between">
            <span>{c.title} — {c.issuer} ({c.year})</span>
            <span className="flex gap-3">
              <button onClick={() => { setNewCertification({ title: c.title, issuer: c.issuer, year: c.year, issuer_logo_url: c.issuer_logo_url ?? '', title_en: c.title_en ?? '', title_ja: c.title_ja ?? '', issuer_en: c.issuer_en ?? '', issuer_ja: c.issuer_ja ?? '', image_url: c.image_url ?? '' }); setEditingCertId(c.id) }} className="text-sky-600 text-sm">Edit</button>
              <button onClick={() => deleteCertification(c.id)} className="text-red-500 text-sm">Hapus</button>
            </span>
          </div>
        ))}
        <form onSubmit={addCertification} className="space-y-2">
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Nama Sertifikat" value={newCertification.title} onChange={(e) => setNewCertification({ ...newCertification, title: e.target.value })} required />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Penerbit (contoh: Dicoding)" value={newCertification.issuer} onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })} required />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Tahun (contoh: 2022)" value={newCertification.year} onChange={(e) => setNewCertification({ ...newCertification, year: e.target.value })} required />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="URL logo penerbit (opsional)" value={newCertification.issuer_logo_url} onChange={(e) => setNewCertification({ ...newCertification, issuer_logo_url: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="URL gambar/sertifikat (opsional)" value={newCertification.image_url} onChange={(e) => setNewCertification({ ...newCertification, image_url: e.target.value })} />
          <input type="file" accept="image/*" className="w-full rounded bg-slate-100 px-3 py-2" onChange={(e) => uploadPortfolioImage(e.target.files?.[0], 'certifications', (url) => setNewCertification({ ...newCertification, image_url: url }))} />
          {uploadingImage && <p className="text-sm text-slate-400">Mengupload gambar...</p>}
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Nama Sertifikat (EN)" value={newCertification.title_en} onChange={(e) => setNewCertification({ ...newCertification, title_en: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Nama Sertifikat (JA)" value={newCertification.title_ja} onChange={(e) => setNewCertification({ ...newCertification, title_ja: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Penerbit (EN)" value={newCertification.issuer_en} onChange={(e) => setNewCertification({ ...newCertification, issuer_en: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Penerbit (JA)" value={newCertification.issuer_ja} onChange={(e) => setNewCertification({ ...newCertification, issuer_ja: e.target.value })} />
          <button className="rounded bg-sky-600 text-white px-4 py-2">{editingCertId ? 'Simpan Perubahan' : 'Tambah Sertifikat'}</button>
        </form>
      </div>

      {/* Education */}
      <div className="rounded-xl bg-white shadow p-6 space-y-3">
        <h2 className="text-xl font-semibold">Education</h2>
        {educations.length === 0 && <p className="text-sm text-slate-400">Belum ada pendidikan tersimpan.</p>}
        {educations.map((e) => (
          <div key={e.id} className="flex items-center justify-between">
            <span>{e.university} — {e.degree} ({e.year})</span>
            <span className="flex gap-3">
              <button onClick={() => { setNewEducation({ university: e.university, degree: e.degree, year: e.year, location: e.location, degree_en: e.degree_en ?? '', degree_ja: e.degree_ja ?? '', location_en: e.location_en ?? '', location_ja: e.location_ja ?? '', university_en: e.university_en ?? '', university_ja: e.university_ja ?? '' }); setEditingEduId(e.id) }} className="text-sky-600 text-sm">Edit</button>
              <button onClick={() => deleteEducation(e.id)} className="text-red-500 text-sm">Hapus</button>
            </span>
          </div>
        ))}
        <form onSubmit={addEducation} className="space-y-2">
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Nama Universitas" value={newEducation.university} onChange={(e) => setNewEducation({ ...newEducation, university: e.target.value })} required />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Gelar / Jurusan (contoh: Bachelor's degree, Computer Science)" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} required />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Tahun (contoh: 2020 - 2024)" value={newEducation.year} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })} required />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Lokasi" value={newEducation.location} onChange={(e) => setNewEducation({ ...newEducation, location: e.target.value })} required />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Universitas (EN)" value={newEducation.university_en} onChange={(e) => setNewEducation({ ...newEducation, university_en: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Universitas (JA)" value={newEducation.university_ja} onChange={(e) => setNewEducation({ ...newEducation, university_ja: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Gelar / Jurusan (EN)" value={newEducation.degree_en} onChange={(e) => setNewEducation({ ...newEducation, degree_en: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Gelar / Jurusan (JA)" value={newEducation.degree_ja} onChange={(e) => setNewEducation({ ...newEducation, degree_ja: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Lokasi (EN)" value={newEducation.location_en} onChange={(e) => setNewEducation({ ...newEducation, location_en: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Lokasi (JA)" value={newEducation.location_ja} onChange={(e) => setNewEducation({ ...newEducation, location_ja: e.target.value })} />
          <button className="rounded bg-sky-600 text-white px-4 py-2">{editingEduId ? 'Simpan Perubahan' : 'Tambah Pendidikan'}</button>
        </form>
      </div>

      {/* Experience */}
      <div className="rounded-xl bg-white shadow p-6 space-y-3">
        <h2 className="text-xl font-semibold">Experience</h2>
        {experiences.length === 0 && <p className="text-sm text-slate-400">Belum ada pengalaman tersimpan.</p>}
        {experiences.map((e) => (
          <div key={e.id} className="flex items-center justify-between">
            <span>{e.position} — {e.workplace} ({e.year})</span>
            <span className="flex gap-3">
              <button onClick={() => { setNewExperience({ year: e.year, position: e.position, workplace: e.workplace, position_en: e.position_en ?? '', position_ja: e.position_ja ?? '', workplace_en: e.workplace_en ?? '', workplace_ja: e.workplace_ja ?? '' }); setEditingExpId(e.id) }} className="text-sky-600 text-sm">Edit</button>
              <button onClick={() => deleteExperience(e.id)} className="text-red-500 text-sm">Hapus</button>
            </span>
          </div>
        ))}
        <form onSubmit={addExperience} className="space-y-2">
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Tahun (contoh: 2023 - 2025)" value={newExperience.year} onChange={(e) => setNewExperience({ ...newExperience, year: e.target.value })} required />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Posisi (contoh: Back End Developer)" value={newExperience.position} onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })} required />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Tempat Kerja" value={newExperience.workplace} onChange={(e) => setNewExperience({ ...newExperience, workplace: e.target.value })} required />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Posisi (EN)" value={newExperience.position_en} onChange={(e) => setNewExperience({ ...newExperience, position_en: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Posisi (JA)" value={newExperience.position_ja} onChange={(e) => setNewExperience({ ...newExperience, position_ja: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Tempat Kerja (EN)" value={newExperience.workplace_en} onChange={(e) => setNewExperience({ ...newExperience, workplace_en: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Tempat Kerja (JA)" value={newExperience.workplace_ja} onChange={(e) => setNewExperience({ ...newExperience, workplace_ja: e.target.value })} />
          <button className="rounded bg-sky-600 text-white px-4 py-2">{editingExpId ? 'Simpan Perubahan' : 'Tambah Pengalaman'}</button>
        </form>
      </div>

      {/* Projects */}
      <div className="rounded-xl bg-white shadow p-6 space-y-3">
        <h2 className="text-xl font-semibold">Projects</h2>
        {projects.length === 0 && <p className="text-sm text-slate-400">Belum ada project tersimpan.</p>}
        {projects.map((p) => (
          <div key={p.id} className="flex items-center justify-between">
            <span>{p.title}</span>
            <span className="flex gap-3">
              <button onClick={() => { setNewProject({ title: p.title, description: p.description, tech_stack: p.tech_stack, live_url: p.live_url, repo_url: p.repo_url, title_en: p.title_en ?? '', title_ja: p.title_ja ?? '', description_en: p.description_en ?? '', description_ja: p.description_ja ?? '', image_url: p.image_url ?? '' }); setEditingProjectId(p.id) }} className="text-sky-600 text-sm">Edit</button>
              <button onClick={() => deleteProject(p.id)} className="text-red-500 text-sm">Hapus</button>
            </span>
          </div>
        ))}
        <form onSubmit={addProject} className="space-y-2">
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Judul" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} required />
          <textarea className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Deskripsi" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Tech stack (pisahkan koma)" value={newProject.tech_stack} onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Live URL" value={newProject.live_url} onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Repo URL" value={newProject.repo_url} onChange={(e) => setNewProject({ ...newProject, repo_url: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="URL screenshot project (opsional)" value={newProject.image_url} onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })} />
          <input type="file" accept="image/*" className="w-full rounded bg-slate-100 px-3 py-2" onChange={(e) => uploadPortfolioImage(e.target.files?.[0], 'projects', (url) => setNewProject({ ...newProject, image_url: url }))} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Judul (EN)" value={newProject.title_en} onChange={(e) => setNewProject({ ...newProject, title_en: e.target.value })} />
          <input className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Judul (JA)" value={newProject.title_ja} onChange={(e) => setNewProject({ ...newProject, title_ja: e.target.value })} />
          <textarea className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Deskripsi (EN)" value={newProject.description_en} onChange={(e) => setNewProject({ ...newProject, description_en: e.target.value })} />
          <textarea className="w-full rounded bg-slate-100 px-3 py-2" placeholder="Deskripsi (JA)" value={newProject.description_ja} onChange={(e) => setNewProject({ ...newProject, description_ja: e.target.value })} />
          <button disabled={addingProject} className="flex items-center gap-2 rounded bg-sky-600 text-white px-4 py-2 disabled:opacity-50">
            {addingProject && <Spinner />}
            {addingProject ? 'Menyimpan...' : editingProjectId ? 'Simpan Perubahan' : 'Tambah Project'}
          </button>
        </form>
      </div>
    </div>
  )
}
