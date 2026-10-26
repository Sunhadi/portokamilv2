import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Certification, Education, Experience, Profile, Project, Skill, SocialLinks } from '../../types'
import AdminShell, { useAdminShell } from './AdminShell'
import {
  Card,
  Field,
  Spinner,
  TriInput,
  badgeCv,
  btnDelete,
  btnEdit,
  btnOutline,
  btnPrimary,
  inputCls,
} from './ui'

const emptyProfile: Profile = { id: 0, name: '', title: '', bio: '', email: '', avatar_url: '' }
const emptyLinks: SocialLinks = { id: 0, github: '', linkedin: '', gitlab: '', twitter: '', instagram: '', youtube: '', website: '' }

function SectionHead({
  title,
  desc,
  open,
  toggle,
  addLabel = 'Ubah',
}: {
  title: string
  desc?: string
  open: boolean
  toggle: () => void
  addLabel?: string
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="font-display text-lg font-bold text-neutral-900">{title}</h2>
        {desc && <p className="mt-0.5 text-sm text-neutral-500">{desc}</p>}
      </div>
      <button type="button" onClick={toggle} className={btnOutline}>
        {open ? 'Tutup' : addLabel}
      </button>
    </div>
  )
}

function AdminContent() {
  const { notify } = useAdminShell()

  const [profile, setProfile] = useState<Profile>(emptyProfile)
  const [links, setLinks] = useState<SocialLinks>(emptyLinks)
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [educations, setEducations] = useState<Education[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [newCertification, setNewCertification] = useState({ title: '', issuer: '', year: '', issuer_logo_url: '', title_en: '', title_ja: '', issuer_en: '', issuer_ja: '', image_url: '', on_cv: false })
  const [newEducation, setNewEducation] = useState({ university: '', degree: '', year: '', location: '', degree_en: '', degree_ja: '', location_en: '', location_ja: '', university_en: '', university_ja: '', on_cv: false })
  const [newExperience, setNewExperience] = useState({ year: '', position: '', workplace: '', position_en: '', position_ja: '', workplace_en: '', workplace_ja: '', location: '', location_en: '', location_ja: '', description: '', description_en: '', description_ja: '', on_cv: false })
  const [newSkill, setNewSkill] = useState({ name: '', level: 80 })
  const [newProject, setNewProject] = useState({ title: '', description: '', tech_stack: '', live_url: '', repo_url: '', title_en: '', title_ja: '', description_en: '', description_ja: '', image_url: '', impact: '', impact_en: '', impact_ja: '', on_cv: false })
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null)
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [editingExpId, setEditingExpId] = useState<number | null>(null)
  const [editingEduId, setEditingEduId] = useState<number | null>(null)
  const [editingCertId, setEditingCertId] = useState<number | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [addingSkill, setAddingSkill] = useState(false)
  const [addingProject, setAddingProject] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [open, setOpen] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadAll()
  }, [])

  const isOpen = (k: string) => !!open[k]
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }))
  const openForm = (k: string) => setOpen((o) => ({ ...o, [k]: true }))

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
    if (!confirm('Hapus skill ini?')) return
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
    setNewProject({ title: '', description: '', tech_stack: '', live_url: '', repo_url: '', title_en: '', title_ja: '', description_en: '', description_ja: '', image_url: '', impact: '', impact_en: '', impact_ja: '', on_cv: false })
    setEditingProjectId(null)
    if (!error) notify('Project berhasil disimpan!')
    setAddingProject(false)
    loadAll()
  }

  async function deleteProject(id: number) {
    if (!confirm('Hapus project ini?')) return
    await supabase.from('projects').delete().eq('id', id)
    loadAll()
  }

  async function addCertification(e: React.FormEvent) {
    e.preventDefault()
    const { error } = editingCertId
      ? await supabase.from('certifications').update(newCertification).eq('id', editingCertId)
      : await supabase.from('certifications').insert(newCertification)
    if (error) alert('Gagal simpan sertifikat: ' + error.message)
    setNewCertification({ title: '', issuer: '', year: '', issuer_logo_url: '', title_en: '', title_ja: '', issuer_en: '', issuer_ja: '', image_url: '', on_cv: false })
    setEditingCertId(null)
    if (!error) notify('Sertifikat berhasil disimpan!')
    loadAll()
  }

  async function deleteCertification(id: number) {
    if (!confirm('Hapus sertifikat ini?')) return
    await supabase.from('certifications').delete().eq('id', id)
    loadAll()
  }

  async function addEducation(e: React.FormEvent) {
    e.preventDefault()
    const { error } = editingEduId
      ? await supabase.from('education').update(newEducation).eq('id', editingEduId)
      : await supabase.from('education').insert(newEducation)
    if (error) alert('Gagal simpan pendidikan: ' + error.message)
    setNewEducation({ university: '', degree: '', year: '', location: '', degree_en: '', degree_ja: '', location_en: '', location_ja: '', university_en: '', university_ja: '', on_cv: false })
    setEditingEduId(null)
    if (!error) notify('Pendidikan berhasil disimpan!')
    loadAll()
  }

  async function deleteEducation(id: number) {
    if (!confirm('Hapus pendidikan ini?')) return
    await supabase.from('education').delete().eq('id', id)
    loadAll()
  }

  async function addExperience(e: React.FormEvent) {
    e.preventDefault()
    const { error } = editingExpId
      ? await supabase.from('experiences').update(newExperience).eq('id', editingExpId)
      : await supabase.from('experiences').insert(newExperience)
    if (error) alert('Gagal simpan pengalaman: ' + error.message)
    setNewExperience({ year: '', position: '', workplace: '', position_en: '', position_ja: '', workplace_en: '', workplace_ja: '', location: '', location_en: '', location_ja: '', description: '', description_en: '', description_ja: '', on_cv: false })
    setEditingExpId(null)
    if (!error) notify('Pengalaman berhasil disimpan!')
    loadAll()
  }

  async function deleteExperience(id: number) {
    if (!confirm('Hapus pengalaman ini?')) return
    await supabase.from('experiences').delete().eq('id', id)
    loadAll()
  }

  const CvBadge = ({ on }: { on?: boolean }) => (on ? <span className={badgeCv}>CV</span> : null)
  const formFoot = (label: string, busy: boolean) => (
    <div className="flex items-center gap-3 pt-1">
      <button type="submit" disabled={busy} className={btnPrimary}>
        {busy && <Spinner />}
        {busy ? 'Menyimpan...' : label}
      </button>
      <button type="button" onClick={() => setOpen((o) => ({ ...o, form: false }))} className="text-sm text-neutral-500 hover:underline">
        Batal
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Kelola Konten</h1>
        <p className="text-sm text-neutral-500">
          Data halaman utama. Item yang dicentang <strong>"Tampilkan di halaman CV"</strong> juga tampil di halaman CV.
        </p>
      </div>

      {/* Profil */}
      <Card title="Profil">
        <SectionHead title="Profil" desc="Data diri untuk halaman utama." open={isOpen('profile')} toggle={() => toggle('profile')} />
        {!isOpen('profile') ? (
          <div className="space-y-3">
            <div className="space-y-1 rounded border border-neutral-100 bg-neutral-50 p-4 text-sm">
              <p><span className="text-neutral-400">Nama:</span> {profile.name || '—'}</p>
              <p><span className="text-neutral-400">Title:</span> {profile.title || '—'}</p>
              <p><span className="text-neutral-400">Email:</span> {profile.email || '—'}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={saveBasic} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nama">
                <input className={inputCls} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </Field>
              <Field label="Email">
                <input className={inputCls} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </Field>
            </div>
            <TriInput label="Title / Pekerjaan" base="title" data={profile} set={(patch) => setProfile({ ...profile, ...patch })} />
            <TriInput textarea label="Bio / Tentang Saya" base="bio" data={profile} set={(patch) => setProfile({ ...profile, ...patch })} />
            {formFoot('Simpan Data Diri', savingProfile)}
          </form>
        )}
      </Card>

      {/* Link Sosial Media */}
      <Card title="Link Sosial Media">
        <SectionHead title="Link Sosial Media" desc="Dipakai ikon sosmed di halaman utama." open={isOpen('links')} toggle={() => toggle('links')} />
        {!isOpen('links') ? (
          <div className="space-y-1 rounded border border-neutral-100 bg-neutral-50 p-4 text-sm">
            {([['GitHub', links.github], ['LinkedIn', links.linkedin], ['GitLab', links.gitlab], ['Twitter/X', links.twitter], ['Instagram', links.instagram], ['YouTube', links.youtube], ['Website', links.website]] as const).map(([k, v]) => (
              <p key={k}><span className="text-neutral-400">{k}:</span> {v || '—'}</p>
            ))}
          </div>
        ) : (
          <form onSubmit={saveLinks} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {(([
                ['github', 'GitHub'], ['linkedin', 'LinkedIn'], ['gitlab', 'GitLab'], ['twitter', 'Twitter/X'],
                ['instagram', 'Instagram'], ['youtube', 'YouTube'], ['website', 'Website'],
              ] as const) as [keyof SocialLinks, string][]).map(([key, label]) => (
                <Field key={key} label={`Link ${label}`}>
                  <input className={inputCls} value={links[key] ?? ''} onChange={(e) => setLinks({ ...links, [key]: e.target.value })} />
                </Field>
              ))}
            </div>
            {formFoot('Simpan Link Sosial Media', savingProfile)}
          </form>
        )}
      </Card>

      {/* Skills */}
      <Card title="Skills">
        <SectionHead title="Skills" desc="Chip keahlian di halaman utama." open={isOpen('skills')} toggle={() => toggle('skills')} addLabel="+ Tambah" />
        <div className="divide-y divide-neutral-100">
          {skills.length === 0 && <p className="py-2 text-sm text-neutral-400">Belum ada skill tersimpan.</p>}
          {skills.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-2">
              <span className="text-sm">{s.name} — {s.level}%</span>
              <span className="flex gap-3">
                <button onClick={() => { setNewSkill({ name: s.name, level: s.level }); setEditingSkillId(s.id); openForm('skills') }} className={btnEdit}>Edit</button>
                <button onClick={() => deleteSkill(s.id)} className={btnDelete}>Hapus</button>
              </span>
            </div>
          ))}
        </div>
        {isOpen('skills') && (
          <form onSubmit={addSkill} className="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Field label="Nama skill">
                <input className={inputCls} value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} required />
              </Field>
            </div>
            <div className="w-32">
              <Field label="Level (%)">
                <input className={inputCls} type="number" min={0} max={100} value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })} />
              </Field>
            </div>
            <button disabled={addingSkill} className={btnPrimary}>
              {addingSkill && <Spinner />}
              {addingSkill ? 'Menyimpan...' : editingSkillId ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </form>
        )}
      </Card>

      {/* Experience */}
      <Card title="Experience">
        <SectionHead title="Pengalaman Kerja" desc="Timeline halaman utama & bagian Pengalaman di CV." open={isOpen('exp')} toggle={() => toggle('exp')} addLabel="+ Tambah" />
        <div className="divide-y divide-neutral-100">
          {experiences.length === 0 && <p className="py-2 text-sm text-neutral-400">Belum ada pengalaman tersimpan.</p>}
          {experiences.map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-3 py-2">
              <span className="flex items-center gap-2 text-sm">
                {e.position} — {e.workplace} ({e.year}) <CvBadge on={e.on_cv} />
              </span>
              <span className="flex gap-3">
                <button onClick={() => { setNewExperience({ year: e.year, position: e.position, workplace: e.workplace, position_en: e.position_en ?? '', position_ja: e.position_ja ?? '', workplace_en: e.workplace_en ?? '', workplace_ja: e.workplace_ja ?? '', location: e.location ?? '', location_en: e.location_en ?? '', location_ja: e.location_ja ?? '', description: e.description ?? '', description_en: e.description_en ?? '', description_ja: e.description_ja ?? '', on_cv: e.on_cv ?? false }); setEditingExpId(e.id); openForm('exp') }} className={btnEdit}>Edit</button>
                <button onClick={() => deleteExperience(e.id)} className={btnDelete}>Hapus</button>
              </span>
            </div>
          ))}
        </div>
        {isOpen('exp') && (
          <form onSubmit={addExperience} className="mt-4 space-y-4 border-t border-neutral-100 pt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Periode (contoh: Aug 2026 – Sekarang)">
                <input className={inputCls} value={newExperience.year} onChange={(e) => setNewExperience({ ...newExperience, year: e.target.value })} required />
              </Field>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm text-neutral-600">
                  <input type="checkbox" className="h-4 w-4 accent-neutral-900" checked={newExperience.on_cv} onChange={(e) => setNewExperience({ ...newExperience, on_cv: e.target.checked })} />
                  Tampilkan di halaman CV
                </label>
              </div>
            </div>
            <TriInput label="Posisi" base="position" data={newExperience} set={(patch) => setNewExperience({ ...newExperience, ...patch })} />
            <TriInput label="Tempat Kerja / Perusahaan" base="workplace" data={newExperience} set={(patch) => setNewExperience({ ...newExperience, ...patch })} />
            <TriInput label="Lokasi" base="location" data={newExperience} set={(patch) => setNewExperience({ ...newExperience, ...patch })} />
            <TriInput textarea label="Keterangan" hint="tampil di halaman utama & CV" base="description" data={newExperience} set={(patch) => setNewExperience({ ...newExperience, ...patch })} />
            {formFoot(editingExpId ? 'Simpan Perubahan' : 'Tambah Pengalaman', false)}
          </form>
        )}
      </Card>

      {/* Education */}
      <Card title="Education">
        <SectionHead title="Pendidikan" desc="Daftar pendidikan di halaman utama & CV." open={isOpen('edu')} toggle={() => toggle('edu')} addLabel="+ Tambah" />
        <div className="divide-y divide-neutral-100">
          {educations.length === 0 && <p className="py-2 text-sm text-neutral-400">Belum ada pendidikan tersimpan.</p>}
          {educations.map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-3 py-2">
              <span className="flex items-center gap-2 text-sm">
                {e.university} — {e.degree} ({e.year}) <CvBadge on={e.on_cv} />
              </span>
              <span className="flex gap-3">
                <button onClick={() => { setNewEducation({ university: e.university, degree: e.degree, year: e.year, location: e.location, degree_en: e.degree_en ?? '', degree_ja: e.degree_ja ?? '', location_en: e.location_en ?? '', location_ja: e.location_ja ?? '', university_en: e.university_en ?? '', university_ja: e.university_ja ?? '', on_cv: e.on_cv ?? false }); setEditingEduId(e.id); openForm('edu') }} className={btnEdit}>Edit</button>
                <button onClick={() => deleteEducation(e.id)} className={btnDelete}>Hapus</button>
              </span>
            </div>
          ))}
        </div>
        {isOpen('edu') && (
          <form onSubmit={addEducation} className="mt-4 space-y-4 border-t border-neutral-100 pt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Tahun (contoh: Jul 2024 – Sekarang)">
                <input className={inputCls} value={newEducation.year} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })} required />
              </Field>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm text-neutral-600">
                  <input type="checkbox" className="h-4 w-4 accent-neutral-900" checked={newEducation.on_cv} onChange={(e) => setNewEducation({ ...newEducation, on_cv: e.target.checked })} />
                  Tampilkan di halaman CV
                </label>
              </div>
            </div>
            <TriInput label="Nama Universitas / Sekolah" base="university" data={newEducation} set={(patch) => setNewEducation({ ...newEducation, ...patch })} />
            <TriInput label="Gelar / Jurusan" base="degree" data={newEducation} set={(patch) => setNewEducation({ ...newEducation, ...patch })} />
            <TriInput label="Lokasi" base="location" data={newEducation} set={(patch) => setNewEducation({ ...newEducation, ...patch })} />
            {formFoot(editingEduId ? 'Simpan Perubahan' : 'Tambah Pendidikan', false)}
          </form>
        )}
      </Card>

      {/* Certifications */}
      <Card title="Certifications">
        <SectionHead title="Sertifikasi" desc="Kartu sertifikat di halaman utama & CV." open={isOpen('cert')} toggle={() => toggle('cert')} addLabel="+ Tambah" />
        <div className="divide-y divide-neutral-100">
          {certifications.length === 0 && <p className="py-2 text-sm text-neutral-400">Belum ada sertifikat tersimpan.</p>}
          {certifications.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 py-2">
              <span className="flex items-center gap-2 text-sm">
                {c.title} — {c.issuer} ({c.year}) <CvBadge on={c.on_cv} />
              </span>
              <span className="flex gap-3">
                <button onClick={() => { setNewCertification({ title: c.title, issuer: c.issuer, year: c.year, issuer_logo_url: c.issuer_logo_url ?? '', title_en: c.title_en ?? '', title_ja: c.title_ja ?? '', issuer_en: c.issuer_en ?? '', issuer_ja: c.issuer_ja ?? '', image_url: c.image_url ?? '', on_cv: c.on_cv ?? false }); setEditingCertId(c.id); openForm('cert') }} className={btnEdit}>Edit</button>
                <button onClick={() => deleteCertification(c.id)} className={btnDelete}>Hapus</button>
              </span>
            </div>
          ))}
        </div>
        {isOpen('cert') && (
          <form onSubmit={addCertification} className="mt-4 space-y-4 border-t border-neutral-100 pt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Tahun (contoh: 2025)">
                <input className={inputCls} value={newCertification.year} onChange={(e) => setNewCertification({ ...newCertification, year: e.target.value })} required />
              </Field>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm text-neutral-600">
                  <input type="checkbox" className="h-4 w-4 accent-neutral-900" checked={newCertification.on_cv} onChange={(e) => setNewCertification({ ...newCertification, on_cv: e.target.checked })} />
                  Tampilkan di halaman CV
                </label>
              </div>
            </div>
            <TriInput label="Nama Sertifikat" base="title" data={newCertification} set={(patch) => setNewCertification({ ...newCertification, ...patch })} />
            <TriInput label="Penerbit" base="issuer" data={newCertification} set={(patch) => setNewCertification({ ...newCertification, ...patch })} />
            <Field label="URL logo penerbit (opsional)">
              <input className={inputCls} value={newCertification.issuer_logo_url} onChange={(e) => setNewCertification({ ...newCertification, issuer_logo_url: e.target.value })} />
            </Field>
            <Field label="Gambar sertifikat">
              <input type="file" accept="image/*" className={inputCls} onChange={(e) => uploadPortfolioImage(e.target.files?.[0], 'certifications', (url) => setNewCertification({ ...newCertification, image_url: url }))} />
              {uploadingImage && <span className="mt-1 block text-xs text-neutral-400">Mengupload gambar...</span>}
            </Field>
            {formFoot(editingCertId ? 'Simpan Perubahan' : 'Tambah Sertifikat', false)}
          </form>
        )}
      </Card>

      {/* Projects */}
      <Card title="Projects">
        <SectionHead title="Proyek" desc="Kartu proyek di halaman utama & Kontribusi Proyek di CV." open={isOpen('project')} toggle={() => toggle('project')} addLabel="+ Tambah" />
        <div className="divide-y divide-neutral-100">
          {projects.length === 0 && <p className="py-2 text-sm text-neutral-400">Belum ada project tersimpan.</p>}
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 py-2">
              <span className="flex items-center gap-2 text-sm">
                {p.title} <CvBadge on={p.on_cv} />
              </span>
              <span className="flex gap-3">
                <button onClick={() => { setNewProject({ title: p.title, description: p.description, tech_stack: p.tech_stack, live_url: p.live_url, repo_url: p.repo_url, title_en: p.title_en ?? '', title_ja: p.title_ja ?? '', description_en: p.description_en ?? '', description_ja: p.description_ja ?? '', image_url: p.image_url ?? '', impact: p.impact ?? '', impact_en: p.impact_en ?? '', impact_ja: p.impact_ja ?? '', on_cv: p.on_cv ?? false }); setEditingProjectId(p.id); openForm('project') }} className={btnEdit}>Edit</button>
                <button onClick={() => deleteProject(p.id)} className={btnDelete}>Hapus</button>
              </span>
            </div>
          ))}
        </div>
        {isOpen('project') && (
          <form onSubmit={addProject} className="mt-4 space-y-4 border-t border-neutral-100 pt-4">
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input type="checkbox" className="h-4 w-4 accent-neutral-900" checked={newProject.on_cv} onChange={(e) => setNewProject({ ...newProject, on_cv: e.target.checked })} />
                Tampilkan di halaman CV
              </label>
            </div>
            <TriInput label="Judul" base="title" data={newProject} set={(patch) => setNewProject({ ...newProject, ...patch })} />
            <TriInput textarea label="Deskripsi" base="description" data={newProject} set={(patch) => setNewProject({ ...newProject, ...patch })} />
            <TriInput label="[Impact] di CV" base="impact" data={newProject} set={(patch) => setNewProject({ ...newProject, ...patch })} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Tech stack (koma)">
                <input className={inputCls} value={newProject.tech_stack} onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })} />
              </Field>
              <Field label="Live URL">
                <input className={inputCls} value={newProject.live_url} onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })} />
              </Field>
              <Field label="Repo URL">
                <input className={inputCls} value={newProject.repo_url} onChange={(e) => setNewProject({ ...newProject, repo_url: e.target.value })} />
              </Field>
            </div>
            <Field label="Gambar project">
              <input type="file" accept="image/*" className={inputCls} onChange={(e) => uploadPortfolioImage(e.target.files?.[0], 'projects', (url) => setNewProject({ ...newProject, image_url: url }))} />
              {uploadingImage && <span className="mt-1 block text-xs text-neutral-400">Mengupload gambar...</span>}
            </Field>
            {formFoot(editingProjectId ? 'Simpan Perubahan' : 'Tambah Project', addingProject)}
          </form>
        )}
      </Card>
    </div>
  )
}

export default function Admin() {
  return (
    <AdminShell>
      <AdminContent />
    </AdminShell>
  )
}
