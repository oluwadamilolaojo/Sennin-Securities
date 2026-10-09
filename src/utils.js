export const naira = (n, opts = {}) => {
  const v = Number(n) || 0
  const dec = opts.dec ?? 0
  return '₦' + v.toLocaleString('en-NG', { minimumFractionDigits: dec, maximumFractionDigits: dec })
}
export const n2 = (n) => (Number(n) || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const n0 = (n) => Math.round(Number(n) || 0).toLocaleString('en-NG')
export const pct = (n, d = 1) => (Number(n) || 0).toFixed(d) + '%'
export const fmtDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
export const fmtTime = (iso) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
export const today = () => new Date().toISOString()
export const uid = (p = 'id') => p + '-' + Math.random().toString(36).slice(2, 8).toUpperCase()
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
export const sum = (arr, f) => arr.reduce((s, x) => s + (f ? f(x) : x), 0)
export const initials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase()
export const addMonths = (iso, m) => { const d = new Date(iso); d.setMonth(d.getMonth() + m); return d.toISOString() }
export const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000)

export function computeFees(amount, s) {
  const v = Number(amount) || 0
  const comm = v * s.commission, sec = v * s.secFee, ngx = v * s.ngxFee, cscs = v * s.cscsFee, stamp = v * s.stampDuty
  const vat = (comm + ngx + cscs) * s.vat
  const total = comm + sec + ngx + cscs + stamp + vat
  return { comm, sec, ngx, cscs, stamp, vat, total }
}

export function amortise(amount, annualRate, months) {
  const r = annualRate / 12
  const pmt = r > 0 ? amount * r / (1 - Math.pow(1 + r, -months)) : amount / months
  let bal = amount
  const rows = []
  for (let i = 1; i <= months; i++) {
    const interest = bal * r
    let principal = pmt - interest
    if (i === months) principal = bal
    bal = Math.max(0, bal - principal)
    rows.push({ n: i, payment: interest + principal, interest, principal, balance: bal })
  }
  return rows
}
