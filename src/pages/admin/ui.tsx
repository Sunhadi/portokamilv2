import type { ReactNode } from 'react'

export function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

export const cardCls = 'rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'
export const h2Cls = 'font-display text-lg font-bold text-neutral-900'
export const subCls = 'mt-0.5 text-sm text-neutral-500'
export const labelCls = 'mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500'
export const inputCls =
  'w-full rounded border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none'
export const btnPrimary =
  'inline-flex items-center gap-2 rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:opacity-50'
export const btnOutline =
  'inline-flex items-center gap-2 rounded border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100'
export const btnEdit = 'text-sm font-medium text-neutral-900 hover:underline'
export const btnDelete = 'text-sm font-medium text-red-500 hover:underline'
export const badgeCv =
  'rounded bg-neutral-900 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  )
}

// Tiga input berdampingan untuk terjemahan ID / EN / JA
export function TriInput({
  label,
  base,
  data,
  set,
  textarea = false,
  hint,
}: {
  label: string
  base: string
  data: Record<string, any>
  set: (patch: Record<string, any>) => void
  textarea?: boolean
  hint?: string
}) {
  const keys = [base, `${base}_en`, `${base}_ja`]
  const langs = ['ID', 'EN', 'JA']
  return (
    <div>
      <span className={labelCls}>
        {label}
        {hint && <span className="ml-2 font-normal normal-case tracking-normal text-neutral-400">{hint}</span>}
      </span>
      <div className="grid gap-2 sm:grid-cols-3">
        {keys.map((k, i) =>
          textarea ? (
            <textarea
              key={k}
              className={`${inputCls} min-h-24`}
              placeholder={`${langs[i]}`}
              value={data[k] ?? ''}
              onChange={(e) => set({ [k]: e.target.value })}
            />
          ) : (
            <input
              key={k}
              className={inputCls}
              placeholder={`${langs[i]}`}
              value={data[k] ?? ''}
              onChange={(e) => set({ [k]: e.target.value })}
            />
          ),
        )}
      </div>
    </div>
  )
}

export function Card({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <section className={cardCls}>
      <div className="mb-4">
        <h2 className={h2Cls}>{title}</h2>
        {desc && <p className={subCls}>{desc}</p>}
      </div>
      {children}
    </section>
  )
}
