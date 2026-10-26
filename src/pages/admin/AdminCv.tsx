import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { CvContent } from '../../types'
import AdminShell, { useAdminShell } from './AdminShell'
import { Card, Spinner, TriInput, btnOutline, btnPrimary, inputCls, labelCls } from './ui'

const emptyCv: CvContent = {
  id: 0,
  name: '',
  role: '',
  email: '',
  phone: '',
  linkedin: '',
  website: '',
  meta_location: '',
  meta_location_en: '',
  meta_location_ja: '',
  meta_exp: '',
  meta_exp_en: '',
  meta_exp_ja: '',
  summary: '',
  summary_en: '',
  summary_ja: '',
  matrix: [],
  skillsets: { hard: '', hard_en: '', hard_ja: '', soft: '', soft_en: '', soft_ja: '' },
  strengths: [],
}

function AdminCvContent() {
  const { notify } = useAdminShell()
  const [cv, setCv] = useState<CvContent>(emptyCv)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  async function load() {
    const r = await supabase.from('cv_content').select('*').limit(1).maybeSingle()
    if (r.data) {
      setCv({
        ...emptyCv,
        ...r.data,
        matrix: r.data.matrix ?? [],
        strengths: r.data.strengths ?? [],
        skillsets: { ...emptyCv.skillsets, ...(r.data.skillsets ?? {}) },
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const fields = {
      name: cv.name, role: cv.role, email: cv.email, phone: cv.phone,
      linkedin: cv.linkedin, website: cv.website,
      meta_location: cv.meta_location, meta_location_en: cv.meta_location_en, meta_location_ja: cv.meta_location_ja,
      meta_exp: cv.meta_exp, meta_exp_en: cv.meta_exp_en, meta_exp_ja: cv.meta_exp_ja,
      summary: cv.summary, summary_en: cv.summary_en, summary_ja: cv.summary_ja,
      matrix: cv.matrix, skillsets: cv.skillsets, strengths: cv.strengths,
    }
    const { error } = cv.id
      ? await supabase.from('cv_content').update(fields).eq('id', cv.id)
      : await supabase.from('cv_content').insert(fields)
    setSaving(false)
    if (error) { alert('Gagal menyimpan halaman CV: ' + error.message); return }
    notify('Halaman CV berhasil disimpan!')
    load()
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-16 text-neutral-500">
        <Spinner />
        <span className="font-mono text-xs uppercase tracking-wider animate-pulse">Memuat konten CV...</span>
      </div>
    )
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Halaman CV</h1>
        <p className="text-sm text-neutral-500">
          Konten halaman <code className="font-mono text-neutral-900">/cv</code>. Bagian pengalaman, pendidikan,
          sertifikat, dan proyek dikelola lewat tab <strong>Konten</strong> dengan centang "Tampilkan di halaman CV".
        </p>
      </div>

      <Card title="Kepala CV" desc="Nama, jabatan, dan kontak yang tampil di bagian atas resume.">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className={labelCls}>Nama</span>
            <input className={inputCls} value={cv.name ?? ''} onChange={(e) => setCv({ ...cv, name: e.target.value })} />
          </label>
          <label className="block">
            <span className={labelCls}>Role / Jabatan</span>
            <input className={inputCls} placeholder="Full Stack Developer" value={cv.role ?? ''} onChange={(e) => setCv({ ...cv, role: e.target.value })} />
          </label>
          <label className="block">
            <span className={labelCls}>Email</span>
            <input className={inputCls} value={cv.email ?? ''} onChange={(e) => setCv({ ...cv, email: e.target.value })} />
          </label>
          <label className="block">
            <span className={labelCls}>Telepon</span>
            <input className={inputCls} value={cv.phone ?? ''} onChange={(e) => setCv({ ...cv, phone: e.target.value })} />
          </label>
          <label className="block">
            <span className={labelCls}>LinkedIn (URL)</span>
            <input className={inputCls} value={cv.linkedin ?? ''} onChange={(e) => setCv({ ...cv, linkedin: e.target.value })} />
          </label>
          <label className="block">
            <span className={labelCls}>Website (URL)</span>
            <input className={inputCls} value={cv.website ?? ''} onChange={(e) => setCv({ ...cv, website: e.target.value })} />
          </label>
        </div>
      </Card>

      <Card title="Meta" desc="Label lokasi & pengalaman singkat di bawah nama (tampil per bahasa).">
        <div className="space-y-4">
          <TriInput label="Lokasi" base="meta_location" data={cv} set={(patch) => setCv({ ...cv, ...patch })} />
          <TriInput label="Pengalaman Singkat" base="meta_exp" data={cv} set={(patch) => setCv({ ...cv, ...patch })} />
        </div>
      </Card>

      <Card title="Ringkasan Profesional">
        <TriInput textarea label="Ringkasan" base="summary" data={cv} set={(patch) => setCv({ ...cv, ...patch })} />
      </Card>

      <Card title="Matriks Keahlian Teknis" desc="Label kategori + isinya, urut sesuai tampilan di CV.">
        <div className="space-y-4">
          {(cv.matrix ?? []).map((row, i) => (
            <div key={i} className="space-y-3 rounded border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Kategori {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setCv({ ...cv, matrix: (cv.matrix ?? []).filter((_, j) => j !== i) })}
                  className="text-sm font-medium text-red-500 hover:underline"
                >
                  Hapus
                </button>
              </div>
              <div>
                <span className={labelCls}>Label Kategori</span>
                <div className="grid gap-2 sm:grid-cols-3">
                  <input className={inputCls} placeholder="ID" value={row.label} onChange={(e) => setCv({ ...cv, matrix: (cv.matrix ?? []).map((r, j) => (j === i ? { ...r, label: e.target.value } : r)) })} />
                  <input className={inputCls} placeholder="EN" value={row.label_en ?? ''} onChange={(e) => setCv({ ...cv, matrix: (cv.matrix ?? []).map((r, j) => (j === i ? { ...r, label_en: e.target.value } : r)) })} />
                  <input className={inputCls} placeholder="JA" value={row.label_ja ?? ''} onChange={(e) => setCv({ ...cv, matrix: (cv.matrix ?? []).map((r, j) => (j === i ? { ...r, label_ja: e.target.value } : r)) })} />
                </div>
              </div>
              <div>
                <span className={labelCls}>Isi / Nilai</span>
                <div className="grid gap-2 sm:grid-cols-3">
                  <input className={inputCls} placeholder="ID" value={row.value} onChange={(e) => setCv({ ...cv, matrix: (cv.matrix ?? []).map((r, j) => (j === i ? { ...r, value: e.target.value } : r)) })} />
                  <input className={inputCls} placeholder="EN" value={row.value_en ?? ''} onChange={(e) => setCv({ ...cv, matrix: (cv.matrix ?? []).map((r, j) => (j === i ? { ...r, value_en: e.target.value } : r)) })} />
                  <input className={inputCls} placeholder="JA" value={row.value_ja ?? ''} onChange={(e) => setCv({ ...cv, matrix: (cv.matrix ?? []).map((r, j) => (j === i ? { ...r, value_ja: e.target.value } : r)) })} />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setCv({ ...cv, matrix: [...(cv.matrix ?? []), { label: '', label_en: '', label_ja: '', value: '', value_en: '', value_ja: '' }] })}
            className={btnOutline}
          >
            + Tambah Kategori
          </button>
        </div>
      </Card>

      <Card title="Keahlian Tambahan">
        <div className="space-y-4">
          <TriInput label="Hard Skills" base="hard" data={cv.skillsets ?? {}} set={(patch) => setCv({ ...cv, skillsets: { ...cv.skillsets, ...patch } })} />
          <TriInput label="Soft Skills" base="soft" data={cv.skillsets ?? {}} set={(patch) => setCv({ ...cv, skillsets: { ...cv.skillsets, ...patch } })} />
        </div>
      </Card>

      <Card title="Nilai Inti & Kekuatan Metodologis" desc="Format: Label: isi — bagian sebelum titik dua tampil tebal di CV.">
        <div className="space-y-4">
          {(cv.strengths ?? []).map((s, i) => (
            <div key={i} className="space-y-3 rounded border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Nilai {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setCv({ ...cv, strengths: (cv.strengths ?? []).filter((_, j) => j !== i) })}
                  className="text-sm font-medium text-red-500 hover:underline"
                >
                  Hapus
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <input className={inputCls} placeholder="Isi (ID)" value={s.text} onChange={(e) => setCv({ ...cv, strengths: (cv.strengths ?? []).map((r, j) => (j === i ? { ...r, text: e.target.value } : r)) })} />
                <input className={inputCls} placeholder="Isi (EN)" value={s.text_en ?? ''} onChange={(e) => setCv({ ...cv, strengths: (cv.strengths ?? []).map((r, j) => (j === i ? { ...r, text_en: e.target.value } : r)) })} />
                <input className={inputCls} placeholder="Isi (JA)" value={s.text_ja ?? ''} onChange={(e) => setCv({ ...cv, strengths: (cv.strengths ?? []).map((r, j) => (j === i ? { ...r, text_ja: e.target.value } : r)) })} />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setCv({ ...cv, strengths: [...(cv.strengths ?? []), { text: '', text_en: '', text_ja: '' }] })}
            className={btnOutline}
          >
            + Tambah Nilai
          </button>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving && <Spinner />}
          {saving ? 'Menyimpan...' : 'Simpan Halaman CV'}
        </button>
        <span className="text-xs text-neutral-400">Konten yang dikosongkan otomatis memakai konten bawaan.</span>
      </div>
    </form>
  )
}

export default function AdminCv() {
  return (
    <AdminShell>
      <AdminCvContent />
    </AdminShell>
  )
}
