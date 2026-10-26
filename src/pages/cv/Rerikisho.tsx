// Tampilan 履歴書 (Rirekisho) berformat A4. Isinya disesuaikan dengan halaman CV versi Jepang.
//
// PRIVASI: halaman ini publik.
// - SHOW_BIRTHDATE: tanggal lahir lengkap (24 Februari 2002) tampil di halaman.
// - SHOW_PRIVATE: alamat rumah lengkap dan nomor telepon. Biarkan false kalau tidak
//   ingin data itu terlihat oleh siapa pun yang membuka situs ini.
const SHOW_BIRTHDATE = true
const SHOW_PRIVATE = false

const R = {
  furigana: 'アフマド スンハディ カミル',
  name: 'Ahmad Sunhadi Kamil',
  gender: '男',
  birthYear: 2002,
  birthMonth: 2,
  birthDay: 24,
  email: 'ahmadsunhadikamil65@gmail.com',
  addressFurigana: 'インドネシア ジャワチュウオウシュウ プルウォレジョケン カリゲシングク ソモンガリデサ',
  addressFull: '〒54175 インドネシア共和国 ジャワ・テングァ州 プルウォレジョ県 カリゲシング郡 ソモンガリ村',
  addressPublic: 'インドネシア共和国 ジョグジャカルタ特別州',
  phones: ['+62 857-5637-3129'],
  photoUrl: '', // isi dengan alamat foto (mis. '/foto-rirekisho.jpg') kalau ingin foto tampil
  dependents: '0人',
  spouse: '無',
  spouseSupport: '無',
  skills:
    '特技： Web開発（React.js, Next.js, Vue.js, Node.js, Express.js, Go, Laravel）、PostgreSQL・MariaDB・Redisを用いたデータベース設計、REST API開発、Docker・GitLab CI/CDの活用、QAテスト、UI/UXデザイン\n強み： テクニカルプロジェクト管理、チームリーダーシップ、クライアントとのコミュニケーション\n趣味： サッカー、フットサル、バドミントン、サイクリング',
  motivation:
    'これまでのフルスタック開発とテクニカルプロジェクト管理の経験を活かし、貴社の事業により一層貢献したいと考え、志望いたしました。技術面とプロジェクト面の両方の視点を持ち、信頼性が高く効率的なアプリケーションを納期どおりに提供することで貴社に貢献するとともに、自身のスキルとキャリアをさらに発展させたいと考えております。',
}

function calcAge(y: number, m: number, d: number, now: Date): number {
  let age = now.getFullYear() - y
  const month = now.getMonth() + 1
  if (month < m || (month === m && now.getDate() < d)) age -= 1
  return age
}

// end: true = teks rata kanan (untuk 「以上」)
type Row = { y?: string; m?: string; text?: string; head?: string; end?: boolean }

const rows: Row[] = [
  { head: '学歴' },
  { y: '2018', m: '4', text: 'タマンシスワ工業高等学校 プルウォレジョ（産業機械工学）入学' },
  { y: '2021', m: '3', text: 'タマンシスワ工業高等学校 プルウォレジョ（産業機械工学）卒業' },
  { y: '2021', m: '9', text: 'ムハマディヤ・プルウォレジョ大学（情報技術）入学' },
  { y: '2025', m: '10', text: 'ムハマディヤ・プルウォレジョ大学（情報技術）卒業' },
  {},
  { head: '職歴' },
  { y: '2024', m: '12', text: 'フリーランス（ジャカルタ）フロントエンド開発者として活動開始' },
  { y: '2026', m: '1', text: 'PT. Stechoq Robotika Indonesia（ジョグジャカルタ特別州）入社　テクニカルプロジェクトマネージャー' },
  { y: '2026', text: 'HENNGE（東京）フルスタック開発者として従事' },
  { text: '現在に至る' },
  { text: '以上', end: true },
  {},
  { head: '免許・資格' },
  { y: '2025', m: '4', text: 'HackerRank - REST API（中級）取得' },
  { y: '2025', m: '4', text: 'HackerRank - フロントエンド開発者（React）取得' },
  { y: '2025', text: 'Dicoding - Kiroによる仕様駆動開発 修了' },
  { y: '2025', text: 'Google - Google Analytics 取得' },
  { y: '2026', m: '5', text: 'Dicoding - AWS クラウドと生成AI基礎 修了' },
  { y: '2026', m: '6', text: 'デジタル人材アカデミー - フルスタック開発 修了' },
  { y: '2026', m: '8', text: 'HackerRank - SQL（中級）取得' },
  { y: '2026', m: '8', text: 'HackerRank - ソフトウェアエンジニア 取得' },
]

const cell = 'border border-neutral-800 px-1.5 py-1.5 align-middle text-[11px] leading-snug break-words sm:px-3 sm:py-2 sm:text-sm'
const label = `${cell} bg-neutral-50 text-center text-[10px] font-normal leading-tight sm:text-xs sm:whitespace-nowrap`

export default function Rirekisho() {
  const now = new Date()
  const asOf = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
  const age = calcAge(R.birthYear, R.birthMonth, R.birthDay, now)
  const birthText = SHOW_BIRTHDATE
    ? `${R.birthYear}年 ${R.birthMonth}月 ${R.birthDay}日生（満${age}歳）`
    : `満${age}歳`
  const addressText = SHOW_PRIVATE ? R.addressFull : R.addressPublic

  return (
    <div className="mx-auto min-w-0 max-w-4xl overflow-hidden border border-neutral-300 bg-white p-3 text-neutral-900 shadow-xs sm:p-6 md:p-12 print:border-none print:p-0 print:shadow-none">
      {/* Judul + tanggal */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="break-words text-2xl font-bold tracking-[0.25em] sm:text-3xl sm:tracking-[0.6em]">履歴書</h2>
        <p className="text-xs sm:text-sm">{asOf} 現在</p>
      </div>

      {/* Identitas + foto */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
        <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-0 table-fixed border-collapse text-[11px] leading-snug sm:min-w-[340px] sm:text-sm">
          <tbody>
            <tr>
              <th className={`${label} w-[4.5rem] sm:w-24`}>ふりがな</th>
              <td className={cell} colSpan={2}>{R.furigana}</td>
            </tr>
            <tr>
              <th className={label}>氏　名</th>
              <td className={`${cell} break-words text-base font-bold sm:text-xl`} colSpan={2}>{R.name}</td>
            </tr>
            <tr>
              <th className={label}>生年月日</th>
              <td className={cell}>{birthText}</td>
              <td className={`${cell} w-16 text-center sm:w-24`}>性別：{R.gender}</td>
            </tr>
            {SHOW_PRIVATE && (
              <tr>
                <th className={label}>ふりがな</th>
                <td className={`${cell} text-xs`} colSpan={2}>{R.addressFurigana}</td>
              </tr>
            )}
            <tr>
              <th className={label}>現住所</th>
              <td className={`${cell} break-words`} colSpan={2}>{addressText}</td>
            </tr>
            {SHOW_PRIVATE &&
              R.phones.map((p, i) => (
                <tr key={p}>
                  <th className={label}>{i === 0 ? '携帯電話' : '連絡先'}</th>
                 <td className={cell} colSpan={2}>{p}</td>
                </tr>
              ))}
            <tr>
              <th className={label}>E-mail</th>
                 <td className={cell} colSpan={2}>
                 <a href={`mailto:${R.email}`} className="break-all hover:underline">{R.email}</a>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        {/* Foto 30 x 40 mm */}
        <div className="flex h-[40mm] w-[30mm] items-center justify-center justify-self-start border border-neutral-800 text-center text-[10px] leading-tight text-neutral-500 sm:justify-self-end">
          {R.photoUrl ? (
            <img src={R.photoUrl} alt={R.name} className="h-full w-full object-cover" />
          ) : (
            <span>写真を貼る位置<br />縦 36〜40mm<br />横 24〜30mm</span>
          )}
        </div>
      </div>

      {/* Riwayat pendidikan, pekerjaan, sertifikasi */}
      <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-0 table-fixed border-collapse text-[11px] leading-snug sm:min-w-[480px] sm:text-sm">
          <thead>
            <tr>
               <th className={`${label} w-8 sm:w-16`}>年</th>
               <th className={`${label} w-7 sm:w-12`}>月</th>
              <th className={label}>学歴・職歴・免許・資格</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
               <tr key={i}>
                <td className={`${cell} text-center`}>{r.y}</td>
                <td className={`${cell} text-center`}>{r.m}</td>
                <td
                  className={`${cell} ${r.head ? 'text-center font-bold tracking-[0.5em]' : ''} ${
                    r.end === true ? 'text-right' : ''
                  }`}
                >
                  {r.head ?? r.text}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tanggungan */}
      <div className="mt-6 sm:hidden">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] border border-neutral-800 text-[11px]">
          <div className={`${label} text-left`}>扶養家族数（配偶者を除く）</div>
          <div className={`${cell} text-center`}>{R.dependents}</div>
          <div className={`${label} text-left`}>配偶者</div>
          <div className={`${cell} text-center`}>{R.spouse}</div>
          <div className={`${label} text-left`}>配偶者の扶養義務</div>
          <div className={`${cell} text-center`}>{R.spouseSupport}</div>
        </div>
      </div>
      <div className="mt-6 hidden overflow-x-auto sm:block">
      <table className="w-full min-w-0 border-collapse text-sm sm:min-w-[480px]">
        <tbody>
          <tr>
            <th className={label}>扶養家族数（配偶者を除く）</th>
            <td className={`${cell} text-center`}>{R.dependents}</td>
            <th className={label}>配偶者</th>
            <td className={`${cell} text-center`}>{R.spouse}</td>
            <th className={label}>配偶者の扶養義務</th>
            <td className={`${cell} text-center`}>{R.spouseSupport}</td>
          </tr>
        </tbody>
      </table>
      </div>

      {/* Keahlian, hobi */}
      <div className="mt-6 border border-neutral-800">
        <p className="border-b border-neutral-800 bg-neutral-50 px-3 py-1.5 text-xs">特技・趣味・得意科目など</p>
        <p className="whitespace-pre-line break-words px-3 py-3 text-xs leading-relaxed sm:text-sm">{R.skills}</p>
      </div>

      {/* Motivasi */}
      <div className="mt-6 border border-neutral-800">
        <p className="border-b border-neutral-800 bg-neutral-50 px-3 py-1.5 text-xs">志望の動機</p>
        <p className="break-words px-3 py-3 text-xs leading-relaxed sm:text-sm">{R.motivation}</p>
      </div>

      {/* Permintaan pribadi (kosong di dokumen asli) */}
      <div className="mt-6 border border-neutral-800">
        <p className="border-b border-neutral-800 bg-neutral-50 px-3 py-1.5 text-xs">
          本人希望記入欄（特に給料・職種・勤務時間・勤務地・その他についての希望などがあれば記入）
        </p>
        <p className="min-h-16 px-3 py-3 text-xs leading-relaxed sm:text-sm">　</p>
      </div>
    </div>
  )
}
