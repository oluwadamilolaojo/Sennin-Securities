// Sample data for the Vendii demo. Figures are illustrative.
export const REGISTRARS = [
  'Meristem Registrars', 'Africa Prudential', 'Coronation Registrars', 'First Registrars', 'Cardinalstone Registrars',
  'Apel Asset Registrars', 'United Securities', 'Greenwich Registrars', 'Pace Registrars', 'EDC Registrars',
  'Veritas Registrars', 'Centurion Registrars', 'Carnation Registrars', 'City Securities Registrars', 'GTL Registrars',
  'Atlas Registrars', 'Union Registrars', 'Datamax Registrars', 'Radix Registrars', 'Sterling Registrars', 'Anchoria Registrars'
]

const hist = (base, seed, n = 26) => {
  let v = base * 0.78, out = []
  for (let i = 0; i < n; i++) {
    const r = Math.sin(seed * 3.7 + i * 1.3) * 0.5 + Math.cos(seed + i * 0.6) * 0.5
    v = v * (1 + r * 0.035 + 0.009)
    out.push(Number(v.toFixed(2)))
  }
  out[n - 1] = base
  return out
}

export const STOCKS = [
  { ticker: 'ZENITHBANK', name: 'Zenith Bank Plc', sector: 'Banking', price: 48.5, prev: 47.8, liquidity: 'High', avgValue: 1.9e9, deals: 1240, pe: 4.8, yld: 9.3, mcap: '₦1.52tn', low52: 31.2, high52: 50.1, bid: 48.4, ask: 48.55, bank: true, etf: false, advance: 0.5,
    nextDiv: { type: 'Interim 2026', amount: 1.25, qual: '2026-10-20', closure: '21 to 27 Oct', pay: '2026-11-07' },
    pastDivs: [{ type: 'Final 2025', amount: 4.0, qual: '2026-03-28', pay: '2026-04-30' }, { type: 'Interim 2025', amount: 1.0, qual: '2025-10-15', pay: '2025-11-05' }], about: 'One of Nigeria\'s largest banks by assets, with operations in Nigeria, Ghana, the UK and elsewhere.' },
  { ticker: 'GTCO', name: 'Guaranty Trust Holding Co', sector: 'Banking', price: 72.1, prev: 71.4, liquidity: 'High', avgValue: 1.6e9, deals: 980, pe: 5.1, yld: 8.1, mcap: '₦2.1tn', low52: 44.0, high52: 76.0, bid: 72.0, ask: 72.2, bank: true, advance: 0.5,
    nextDiv: { type: 'Interim 2026', amount: 1.0, qual: '2026-10-12', closure: '13 to 17 Oct', pay: '2026-10-30' },
    pastDivs: [{ type: 'Final 2025', amount: 7.0, qual: '2026-03-20', pay: '2026-04-10' }], about: 'Holding company for Guaranty Trust Bank and its payments, asset management and pension subsidiaries.' },
  { ticker: 'MTNN', name: 'MTN Nigeria', sector: 'Telecoms', price: 265.0, prev: 262.5, liquidity: 'High', avgValue: 2.4e9, deals: 820, pe: 11.2, yld: 4.2, mcap: '₦5.6tn', low52: 160.0, high52: 290.0, bid: 264.5, ask: 265.5, advance: 0.55,
    nextDiv: { type: 'Final 2026', amount: 7.0, qual: '2027-03-15', closure: 'tbc', pay: '2027-04-20' },
    pastDivs: [{ type: 'Interim 2026', amount: 5.6, qual: '2026-08-22', pay: '2026-09-05' }], about: 'Nigeria\'s largest mobile network operator by subscribers.' },
  { ticker: 'DANGCEM', name: 'Dangote Cement', sector: 'Industrial goods', price: 470.0, prev: 468.0, liquidity: 'Medium', avgValue: 6.4e8, deals: 310, pe: 9.6, yld: 6.4, mcap: '₦8.0tn', low52: 380.0, high52: 520.0, bid: 468.0, ask: 472.0, advance: 0.45,
    nextDiv: { type: 'Final 2026', amount: 30.0, qual: '2027-04-10', closure: 'tbc', pay: '2027-04-28' },
    pastDivs: [{ type: 'Final 2025', amount: 30.0, qual: '2026-04-10', pay: '2026-04-28' }], about: 'Africa\'s largest cement producer, with plants across Nigeria and nine other countries.' },
  { ticker: 'SEPLAT', name: 'Seplat Energy', sector: 'Oil and gas', price: 5200.0, prev: 5140.0, liquidity: 'High', avgValue: 9.0e8, deals: 140, pe: 7.2, yld: 3.1, mcap: '₦3.1tn', low52: 3100.0, high52: 5400.0, bid: 5180.0, ask: 5220.0, advance: 0.5,
    nextDiv: { type: 'Q3 2026', amount: 60.0, qual: '2026-11-05', closure: 'tbc', pay: '2026-11-28' }, pastDivs: [], about: 'Independent oil and gas company listed in Lagos and London.' },
  { ticker: 'NAHCO', name: 'Nigerian Aviation Handling Co', sector: 'Services', price: 78.4, prev: 80.7, liquidity: 'Thin', avgValue: 1.2e7, deals: 18, pe: 14.0, yld: 2.0, mcap: '₦127bn', low52: 40.0, high52: 92.0, bid: 77.0, ask: 80.0, advance: 0,
    nextDiv: null, pastDivs: [{ type: 'Final 2025', amount: 1.5, qual: '2026-05-02', pay: '2026-05-28' }], about: 'Ground handling services at Nigerian airports.' },
  { ticker: 'STANBICETF30', name: 'Stanbic IBTC ETF 30', sector: 'ETF', price: 180.0, prev: 178.5, liquidity: 'Medium', avgValue: 1.2e8, deals: 60, pe: null, yld: 3.6, mcap: '₦28bn', low52: 130.0, high52: 185.0, bid: 178.0, ask: 182.0, etf: true, advance: 0.45,
    nextDiv: null, pastDivs: [], about: 'Tracks the NGX 30 index. NAV ₦176.40; trades at a 2% premium today.' },
  { ticker: 'UBA', name: 'United Bank for Africa', sector: 'Banking', price: 41.8, prev: 40.8, liquidity: 'High', avgValue: 1.1e9, deals: 1050, pe: 3.9, yld: 10.2, mcap: '₦1.4tn', low52: 24.0, high52: 44.0, bid: 41.7, ask: 41.9, bank: true, advance: 0.5,
    nextDiv: { type: 'Interim 2026', amount: 2.0, qual: '2026-10-28', closure: 'tbc', pay: '2026-11-18' }, pastDivs: [], about: 'Pan-African bank with operations in 20 countries.' },
  { ticker: 'ARADEL', name: 'Aradel Holdings', sector: 'Oil and gas', price: 610.0, prev: 613.7, liquidity: 'Medium', avgValue: 3.2e8, deals: 95, pe: 8.8, yld: 3.9, mcap: '₦2.6tn', low52: 400.0, high52: 650.0, bid: 605.0, ask: 615.0, advance: 0.45,
    nextDiv: null, pastDivs: [], about: 'Integrated energy company, formerly Niger Delta Exploration and Production.' },
  { ticker: 'NGXGROUP', name: 'Nigerian Exchange Group', sector: 'Financial services', price: 85.0, prev: 85.0, liquidity: 'Medium', avgValue: 9.0e7, deals: 70, pe: 12.5, yld: 2.4, mcap: '₦170bn', low52: 20.0, high52: 90.0, bid: 84.0, ask: 86.0, advance: 0.4,
    nextDiv: null, pastDivs: [], about: 'Owner of the Nigerian Exchange and its market data and regulation businesses.' },
  { ticker: 'NESTLE', name: 'Nestle Nigeria', sector: 'Consumer goods', price: 1250.0, prev: 1248.0, liquidity: 'Medium', avgValue: 2.1e8, deals: 44, pe: 18.0, yld: 2.1, mcap: '₦990bn', low52: 800.0, high52: 1300.0, bid: 1240.0, ask: 1260.0, advance: 0.45,
    nextDiv: null, pastDivs: [], about: 'Food and beverage manufacturer, majority owned by Nestle SA.' },
  { ticker: 'FLOURMILL', name: 'Flour Mills of Nigeria', sector: 'Consumer goods', price: 96.0, prev: 95.1, liquidity: 'Medium', avgValue: 1.4e8, deals: 85, pe: 7.5, yld: 4.8, mcap: '₦390bn', low52: 55.0, high52: 100.0, bid: 95.5, ask: 96.5, advance: 0.4,
    nextDiv: null, pastDivs: [], about: 'Food, agro-allied and packaging group, maker of Golden Penny.' },
  { ticker: 'BUACEMENT', name: 'BUA Cement', sector: 'Industrial goods', price: 118.0, prev: 119.2, liquidity: 'Medium', avgValue: 2.8e8, deals: 120, pe: 22.0, yld: 1.8, mcap: '₦4.0tn', low52: 90.0, high52: 130.0, bid: 117.0, ask: 119.0, advance: 0.4,
    nextDiv: null, pastDivs: [], about: 'Second-largest cement producer in Nigeria.' },
  { ticker: 'AIRTELAFRI', name: 'Airtel Africa', sector: 'Telecoms', price: 2200.0, prev: 2190.0, liquidity: 'Thin', avgValue: 4.0e7, deals: 12, pe: 13.0, yld: 2.6, mcap: '₦8.2tn', low52: 1900.0, high52: 2400.0, bid: 2150.0, ask: 2250.0, advance: 0.3,
    nextDiv: null, pastDivs: [], about: 'Telecoms and mobile money operator across 14 African countries.' },
]
STOCKS.forEach((s, i) => { s.history = hist(s.price, i + 1) })

export const BOND_WINDOW = {
  month: 'October 2026', opens: '2026-10-05', closes: '2026-10-09T17:00:00', settles: '2026-10-14',
  rates: { 2: 14.319, 3: 15.319 }, matures: { 2: '2028-10-14', 3: '2029-10-14' }, firstCoupon: '2027-01-14'
}

export const INDEX = { asi: 165412.08, asiChg: 0.6, banking: 1842.11, bankingChg: 1.1, mcap: '₦104.2tn' }

export const USER = {
  id: 'u-1', name: 'Damilola Ojo', firstName: 'Damilola', email: 'damilola@example.com', phone: '0803 000 0221',
  bvnLast: '3321', ninLast: '8804', chn: '2210045', tier: 2, kyc: 'Verified', joined: '2026-09-02',
  bank: { name: 'GTBank', last4: '4417', accountName: 'DAMILOLA OJO' },
  beneficiary: { name: 'Adaeze Ojo', relationship: 'Spouse', phone: '0803 000 0000', confirmed: '2026-10-07' },
  risk: 'Balanced', experience: 'Some', virtualAccount: { bank: 'Trust Bank', number: '9034 221 0045' },
  security: { biometric: true, timeout: true, screenshots: true, devices: ['MacBook Pro (this device)', 'Pixel 8'] },
}

export const HOLDINGS = [
  { ticker: 'ZENITHBANK', units: 12000, avgCost: 38.2 },
  { ticker: 'GTCO', units: 9000, avgCost: 61.4 },
  { ticker: 'MTNN', units: 3500, avgCost: 240.0 },
  { ticker: 'DANGCEM', units: 2200, avgCost: 455.0 },
  { ticker: 'STANBICETF30', units: 4000, avgCost: 168.0 },
  { ticker: 'NAHCO', units: 8000, avgCost: 82.0 },
]
export const BONDS = [
  { id: 'b-1', name: 'FGN Savings Bond', issue: 'Sep 2026', tenor: 3, rate: 15.12, units: 300, amount: 300000, issued: '2026-09-16', matures: '2029-09-16', nextCoupon: '2026-12-16' },
]
export const CASH = { settled: 215000, unsettled: 48500, unsettledDate: '2026-10-09', sweep: false }

export const ORDERS = [
  { id: 'VND-26-004812', ts: '2026-10-07T10:42:00', side: 'Buy', ticker: 'ZENITHBANK', units: 2000, filled: 1400, type: 'Limit', limit: 48.5, status: 'Partly filled', validity: 'Day', owner: 'u-1', timeline: [['Received', '2026-10-07T10:42:00'], ['Sent to broker', '2026-10-07T10:43:00'], ['On exchange', '2026-10-07T10:51:00'], ['Partly filled', '2026-10-07T11:20:00']] },
  { id: 'VND-26-004809', ts: '2026-10-07T09:58:00', side: 'Sell', ticker: 'NAHCO', units: 3000, filled: 0, type: 'Limit', limit: 80.0, status: 'On exchange', validity: 'Day', owner: 'u-1', timeline: [['Received', '2026-10-07T09:58:00'], ['Sent to broker', '2026-10-07T10:01:00'], ['On exchange', '2026-10-07T10:04:00']] },
  { id: 'VND-26-004801', ts: '2026-10-06T19:20:00', side: 'Buy', ticker: 'STANBICETF30', units: 1000, filled: 0, type: 'Market', limit: null, status: 'Queued for open', validity: 'Day', owner: 'u-1', timeline: [['Received', '2026-10-06T19:20:00']] },
  { id: 'VND-26-004790', ts: '2026-10-03T11:02:00', side: 'Buy', ticker: 'GTCO', units: 1000, filled: 1000, type: 'Limit', limit: 71.8, status: 'Settled', validity: 'Day', owner: 'u-1', total: 73215, timeline: [['Received', '2026-10-03T11:02:00'], ['Sent to broker', '2026-10-03T11:03:00'], ['On exchange', '2026-10-03T11:10:00'], ['Filled', '2026-10-03T11:41:00'], ['Settled', '2026-10-06T16:00:00']] },
  { id: 'VND-26-004771', ts: '2026-09-26T10:15:00', side: 'Buy', ticker: 'MTNN', units: 500, filled: 500, type: 'Market', limit: null, status: 'Settled', validity: 'Day', owner: 'u-1', total: 131541, timeline: [['Received', '2026-09-26T10:15:00'], ['Filled', '2026-09-26T10:22:00'], ['Settled', '2026-09-30T16:00:00']] },
  { id: 'VND-26-004702', ts: '2026-09-09T12:30:00', side: 'Sell', ticker: 'DANGCEM', units: 200, filled: 200, type: 'Limit', limit: 462.0, status: 'Settled', validity: 'Day', owner: 'u-1', total: 90615, timeline: [['Received', '2026-09-09T12:30:00'], ['Filled', '2026-09-09T13:05:00'], ['Settled', '2026-09-12T16:00:00']] },
  { id: 'VND-26-004813', ts: '2026-10-07T10:50:00', side: 'Buy', ticker: 'UBA', units: 5000, filled: 0, type: 'Market', limit: null, status: 'Received', validity: 'Day', owner: 'u-2', ownerName: 'Fatima Abubakar', timeline: [['Received', '2026-10-07T10:50:00']] },
  { id: 'VND-26-004814', ts: '2026-10-07T11:05:00', side: 'Sell', ticker: 'MTNN', units: 800, filled: 0, type: 'Limit', limit: 268.0, status: 'Received', validity: 'Day', owner: 'u-3', ownerName: 'Chinedu Eze', timeline: [['Received', '2026-10-07T11:05:00']] },
  { id: 'VND-26-004815', ts: '2026-10-07T11:12:00', side: 'Buy', ticker: 'SEPLAT', units: 40, filled: 0, type: 'Limit', limit: 5150.0, status: 'Sent to broker', validity: 'Day', owner: 'u-4', ownerName: 'Bola Adeyemi', timeline: [['Received', '2026-10-07T11:12:00'], ['Sent to broker', '2026-10-07T11:14:00']] },
]

export const PAID_DIVIDENDS = [
  { ticker: 'MTNN', type: 'Interim 2026', perUnit: 5.6, units: 3500, pay: '2026-09-05', gross: 19600, wht: 1960, net: 17640 },
  { ticker: 'DANGCEM', type: 'Final 2025', perUnit: 30.0, units: 2200, pay: '2026-04-28', gross: 66000, wht: 6600, net: 59400 },
  { ticker: 'ZENITHBANK', type: 'Final 2025', perUnit: 4.0, units: 12000, pay: '2026-04-30', gross: 48000, wht: 4800, net: 43200 },
  { ticker: 'GTCO', type: 'Final 2025', perUnit: 7.0, units: 8000, pay: '2026-04-10', gross: 56000, wht: 5600, net: 50400 },
  { ticker: 'ZENITHBANK', type: 'Interim 2025', perUnit: 1.0, units: 12000, pay: '2025-11-05', gross: 12000, wht: 1200, net: 10800 },
]

export const CLAIMS = [
  { id: 'CLM-0412', owner: 'u-1', company: 'Nestle Nigeria', registrar: 'Meristem Registrars', years: '2014 to 2019', amount: 41200, status: 'Paid', step: 5, updated: '2026-09-29', note: 'Paid to GTBank ••4417' },
  { id: 'CLM-0413', owner: 'u-1', company: 'Flour Mills of Nigeria', registrar: 'Africa Prudential', years: '2016 to 2022', amount: 52750, status: 'With registrar', step: 3, updated: '2026-09-25', note: 'Day 12 of 20 working days' },
  { id: 'CLM-0414', owner: 'u-1', company: 'Lafarge Africa', registrar: 'Coronation Registrars', years: '2012 to 2018', amount: 23900, status: 'Action needed', step: 2, updated: '2026-10-02', note: 'Registrar wants the old certificate uploaded' },
  { id: 'CLM-0415', owner: 'u-1', company: 'UBA', registrar: 'Africa Prudential', years: '2020 to 2023', amount: 9600, status: 'Submitted', step: 2, updated: '2026-10-05', note: '' },
  { id: 'CLM-0398', owner: 'u-2', ownerName: 'Fatima Abubakar', company: 'First HoldCo', registrar: 'First Registrars', years: '2010 to 2017', amount: 118400, status: 'With registrar', step: 3, updated: '2026-09-30', note: '' },
  { id: 'CLM-0401', owner: 'u-3', ownerName: 'Chinedu Eze', company: 'Dangote Cement', registrar: 'Meristem Registrars', years: '2019 to 2024', amount: 64000, status: 'Identity check', step: 2, updated: '2026-10-03', note: 'Name variant: Chinedu vs Chinedum' },
  { id: 'CLM-0402', owner: 'u-5', ownerName: 'Estate of Samuel Okoro', company: 'Nigerian Breweries', registrar: 'First Registrars', years: '2008 to 2020', amount: 212500, status: 'Awaiting probate', step: 1, updated: '2026-10-01', note: 'Letters of administration requested' },
  { id: 'CLM-0405', owner: 'u-6', ownerName: 'Grace Nwosu', company: 'Unilever Nigeria', registrar: 'Cardinalstone Registrars', years: '2015 to 2021', amount: 31800, status: 'Paid', step: 5, updated: '2026-09-18', note: 'Fee collected' },
]

export const MANDATES = [
  { registrar: 'Meristem Registrars', status: 'Active' }, { registrar: 'Africa Prudential', status: 'Active' },
  { registrar: 'Coronation Registrars', status: 'Needed' }, { registrar: 'Cardinalstone Registrars', status: 'Needed' },
]

export const LOANS = [
  { id: 'VBL-2026-00118', owner: 'u-1', ownerName: 'Damilola Ojo', status: 'Active', amount: 900000, outstanding: 757311, rate: 0.24, tenor: 6, plan: 'Monthly', start: '2026-10-14', purpose: 'Personal',
    collateral: [{ ticker: 'MTNN', units: 3500 }, { ticker: 'DANGCEM', units: 2200 }, { ticker: 'GTCO', units: 9000 }],
    payments: [{ n: 1, date: '2026-11-14', amount: 160689, status: 'Paid' }],
    alerts: [['2026-10-14T09:00:00', 'Lien placed at CSCS on 3 securities', 'email'], ['2026-10-14T10:30:00', 'Loan paid out ₦900,000 to GTBank ••4417', 'SMS, WhatsApp, email'], ['2026-11-14T08:05:00', 'Payment 1 of 6 received', 'SMS, email, app']] },
  { id: 'VBL-2026-00241', owner: 'u-2', ownerName: 'Fatima Abubakar', status: 'Active', amount: 1400000, outstanding: 1180400, rate: 0.24, tenor: 9, plan: 'Monthly', start: '2026-09-02', purpose: 'Business', collateral: [{ ticker: 'ZENITHBANK', units: 20000 }, { ticker: 'UBA', units: 18000 }], payments: [], alerts: [] },
  { id: 'VBL-2026-00097', owner: 'u-3', ownerName: 'Chinedu Eze', status: 'Active', amount: 600000, outstanding: 462000, rate: 0.24, tenor: 6, plan: 'Interest only', start: '2026-08-10', purpose: 'Personal', collateral: [{ ticker: 'SEPLAT', units: 150 }], payments: [], alerts: [] },
  { id: 'VBL-2026-00310', owner: 'u-4', ownerName: 'Bola Adeyemi', status: 'Pending approval', amount: 2500000, outstanding: 2500000, rate: 0.24, tenor: 12, plan: 'Monthly', start: null, purpose: 'Property', collateral: [{ ticker: 'MTNN', units: 8000 }, { ticker: 'DANGCEM', units: 3000 }], payments: [], alerts: [] },
]

export const ADMIN_USERS = [
  { id: 'u-1', name: 'Damilola Ojo', email: 'damilola@example.com', tier: 2, kyc: 'Verified', joined: '2026-09-02', chn: '2210045', holdings: 4862310 },
  { id: 'u-2', name: 'Fatima Abubakar', email: 'fatima@example.com', tier: 3, kyc: 'Verified', joined: '2026-08-14', chn: '1845023', holdings: 3200000 },
  { id: 'u-3', name: 'Chinedu Eze', email: 'chinedu@example.com', tier: 2, kyc: 'Verified', joined: '2026-08-30', chn: '2003311', holdings: 1900000 },
  { id: 'u-4', name: 'Bola Adeyemi', email: 'bola@example.com', tier: 3, kyc: 'Verified', joined: '2026-07-21', chn: '1788402', holdings: 7400000 },
  { id: 'u-5', name: 'Estate of Samuel Okoro', email: 'okoro.estate@example.com', tier: 1, kyc: 'Documents pending', joined: '2026-09-28', chn: null, holdings: 0 },
  { id: 'u-6', name: 'Grace Nwosu', email: 'grace@example.com', tier: 1, kyc: 'Verified', joined: '2026-09-12', chn: '2219980', holdings: 420000 },
  { id: 'u-7', name: 'Tunde Bakare', email: 'tunde@example.com', tier: 1, kyc: 'Selfie mismatch', joined: '2026-10-06', chn: null, holdings: 0 },
  { id: 'u-8', name: 'Ngozi Okafor', email: 'ngozi@example.com', tier: 1, kyc: 'Pending review', joined: '2026-10-07', chn: null, holdings: 0 },
  { id: 'u-9', name: 'Ibrahim Musa', email: 'ibrahim@example.com', tier: 2, kyc: 'Pending review', joined: '2026-10-07', chn: 'pending', holdings: 0 },
  { id: 'u-10', name: 'Yemi Alade', email: 'yemi@example.com', tier: 1, kyc: 'Verified', joined: '2026-10-04', chn: '2231190', holdings: 55000 },
]

export const AML_FLAGS = [
  { id: 'AML-031', user: 'Tunde Bakare', type: 'Selfie mismatch at signup', risk: 'Medium', opened: '2026-10-06', status: 'Open' },
  { id: 'AML-032', user: 'Ibrahim Musa', type: 'PEP list possible match', risk: 'High', opened: '2026-10-07', status: 'Open' },
  { id: 'AML-029', user: 'Bola Adeyemi', type: 'Deposit above tier limit', risk: 'Low', opened: '2026-10-01', status: 'Resolved' },
]
export const COMPLAINTS = [
  { id: 'CMP-118', user: 'Grace Nwosu', subject: 'Withdrawal took 2 days', opened: '2026-10-05', due: '2026-10-12', status: 'Open', channel: 'WhatsApp' },
  { id: 'CMP-117', user: 'Chinedu Eze', subject: 'Order filled at a worse price than shown', opened: '2026-10-02', due: '2026-10-09', status: 'Investigating', channel: 'In-app chat' },
  { id: 'CMP-112', user: 'Fatima Abubakar', subject: 'Dividend amount lower than estimate', opened: '2026-09-24', due: '2026-10-01', status: 'Resolved', channel: 'Email' },
]

export const SETTINGS = {
  commission: 0.0135, secFee: 0.003, ngxFee: 0.003, cscsFee: 0.0006, stampDuty: 0.00075, vat: 0.075,
  recoveryFee: 0.10, loanRate: 0.24, arrangementFee: 0.01, lienFee: 2500,
  warnLtv: 0.625, callLtv: 0.714, liqLtv: 0.80, maxConcentration: 0.40, maxStockShareOfBook: 0.25, programmeLimit: 1.5e9,
  marketShock: 0, cureDays: 3,
  flags: { trading: true, lending: true, recovery: true, mmfSweep: false, recurring: false, ipo: false, realtimePrices: false },
  advance: Object.fromEntries(STOCKS.map(s => [s.ticker, s.advance])),
}

export const NOTIFICATIONS = [
  { id: 'n-1', ts: '2026-10-07T11:20:00', title: 'Order partly filled', body: '1,400 of 2,000 ZENITHBANK filled at ₦48.50', read: false },
  { id: 'n-2', ts: '2026-10-07T08:00:00', title: 'Dividend coming', body: 'GTCO interim ₦1.00 per unit. Qualification date 12 Oct.', read: false },
  { id: 'n-3', ts: '2026-10-06T16:05:00', title: 'Sale settling', body: '₦48,500 from your NAHCO sale lands Thursday', read: true },
]

export const AUDIT = [
  { ts: '2026-10-07T10:43:00', actor: 'Order desk (A. Bello)', action: 'Sent order to broker', detail: 'VND-26-004812 ZENITHBANK buy 2,000' },
  { ts: '2026-10-07T09:15:00', actor: 'System', action: 'Collateral revalued', detail: '318 loans, 0 new calls' },
  { ts: '2026-10-06T17:30:00', actor: 'Claims (K. Obi)', action: 'Claim submitted to registrar', detail: 'CLM-0415 UBA via Africa Prudential' },
  { ts: '2026-10-06T12:10:00', actor: 'Compliance (R. Ade)', action: 'Flag resolved', detail: 'AML-029 deposit explained by salary payment' },
]

export const LEARN = [
  { slug: 'chn', title: 'What is a CHN, and do I have one?', mins: 3, body: 'A Clearing House Number is your account at the Central Securities Clearing System. Every Nigerian shareholder who bought shares through a broker since the late 1990s has one. Shares sit there in your own name, not your broker\'s. If you only hold paper certificates, you may not have a CHN yet; Vendii opens one for you through Trust Bank Securities and can dematerialise old certificates into it.' },
  { slug: 'estate', title: 'Claiming a late relative\'s shares', mins: 6, body: 'You need the death certificate and either letters of administration (no will) or probate (with a will). The registrar then transmits the shares to the estate or heirs, and releases unclaimed dividends. Vendii prepares the registrar forms and tracks each registrar separately, because each has its own checklist.' },
  { slug: 'savings-bond', title: 'The FGN Savings Bond, explained', mins: 4, body: 'The Debt Management Office issues a savings bond every month. Minimum ₦5,000, maximum ₦50m, in units of ₦1,000. It pays interest every quarter and returns your money after two or three years. Interest is tax free. It is backed by the Federal Government and can be sold on the exchange before maturity, though buyers can take time to find.' },
  { slug: 'margin-call', title: 'How a margin call works, with a naira example', mins: 5, body: 'Say you borrow ₦900,000 against shares worth ₦2.57m. The loan is 35% of the shares\' value. If the shares fall to ₦1.26m, the loan is 71.4% of their value and we ask you to add cash or shares within three working days. If they fall to ₦1.13m and nothing is added, enough shares are sold to bring the loan back to 62.5%, and everything else stays yours.' },
]
