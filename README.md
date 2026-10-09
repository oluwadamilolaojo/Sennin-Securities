# Vendii: website, trading app, lending app and admin console

One React codebase with four surfaces that link to each other:

| Surface | Route | What it is |
|---|---|---|
| Website | `/` | Marketing site: dividend checker, Invest, Borrow, Pricing, Safety, Learn, waitlist |
| Sign in / sign up | `/signin`, `/signup` | Demo auth and the five-step onboarding wizard |
| Trading app | `/app` | Portfolio, markets, stock pages with live order ticket, orders, fixed income, dividends and recovery, funding, settings, support |
| Lending app | `/lend` | Eligibility, loan builder, review and sign, loan dashboard with warning and margin call states, documents |
| Admin console | `/admin` | Overview, order desk, KYC, recovery claims pipeline, loan book and margin calls, compliance, fees and feature flags, audit log |

## Run it

```
npm install
npm run dev
```

Open http://localhost:5173. `npm run build` produces a static bundle in `dist/`.

## Demo sign-in

- Customer: any email, any password of 4+ characters, any 6-digit code.
- Staff: `/signin?staff=1`, same rules. Or use the "Staff console" link in the trading app sidebar.
- Transaction PIN in the apps: any 4 digits. CSCS and bank codes: any 6 digits.

## How the pieces connect

- Website dividend check → "Recover it with your BVN" → sign-up → trading app, Dividends tab.
- Trading app sidebar → "Borrow against shares" → lending app. Lending sidebar → back to trading.
- Orders placed in the trading app appear on the admin Order desk. Moving them to Settled updates the customer's cash and holdings.
- Loan applications signed in the lending app appear under Admin → Loan book → Applications. Approving places the lien and pays out.
- Admin → Fees, rates and flags → Market shock pushes every price down. Above about 54% the loan enters the warning zone, above 59% the margin call state, which changes the lending dashboard, the trading home banner and the admin margin call queue. Feature flags pause products everywhere at once.
- Every action writes to the audit log.

## Where things are

```
src/
  data/mock.js          sample securities, user, holdings, orders, claims, loans, settings
  store/store.jsx       reducer, actions, selectors (portfolio, loanMetrics, eligibleCollateral)
  utils.js              naira formatting, fees, amortisation
  components/           ui.jsx (pills, stats, health bar, order steps, modal), DividendChecker, FeeCalc
  layouts/              SiteLayout, Shell (sidebar + top bar), AppShell, LendShell, AdminShell
  pages/site            Home, Check, Invest, Borrow, Pricing, Safety, Learn, Waitlist
  pages/auth            SignIn, SignUp
  pages/app             Dashboard, Markets, Stock, Orders, FixedIncome, Dividends, Funding, Settings, Support, Notifications
  pages/lend            Dashboard, Start, Build, Review, Documents, Learn
  pages/admin           Overview, OrderDesk, Users, Claims, Lending, Compliance, Settings, Audit
  styles.css            design tokens and all styling (Space Grotesk, Vendii ink/blue/gold)
test/                   server-side render of every route and a reducer walkthrough
```

State persists in `localStorage` under `vendii-demo-v3`. Reset it from Admin → Fees, rates and flags → Reset demo data.

## What is sample or placeholder

All prices, balances, dates, counts and rates are sample data. Text in [brackets] (legal entity, SEC registration number, address, support hours, commission and loan rates) needs real values. Fee rates in `data/mock.js` SETTINGS are editable at runtime in the admin console.

## Wiring to a backend

Replace `store/store.jsx` dispatches with API calls (Supabase or Firebase both fit). The reducer cases are the API surface: PLACE_ORDER, ADVANCE_ORDER, DEPOSIT, WITHDRAW, SUBSCRIBE_BOND, START_CLAIMS, ADVANCE_CLAIM, SUBMIT_MANDATE, CREATE_LOAN, APPROVE_LOAN, REPAY, PLEDGE_MORE, LIQUIDATE, KYC, RESOLVE_FLAG, COMPLAINT, SETTINGS, FLAG, ADVANCE_RATE. Selectors in the same file become server-side calculations.
