import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { StoreProvider, useStore } from './store/store.jsx'
import SiteLayout from './layouts/SiteLayout.jsx'
import AppShell from './layouts/AppShell.jsx'
import LendShell from './layouts/LendShell.jsx'
import AdminShell from './layouts/AdminShell.jsx'
import Home from './pages/site/Home.jsx'
import Check from './pages/site/Check.jsx'
import Invest from './pages/site/Invest.jsx'
import Borrow from './pages/site/Borrow.jsx'
import Pricing from './pages/site/Pricing.jsx'
import Safety from './pages/site/Safety.jsx'
import Learn from './pages/site/Learn.jsx'
import SignIn from './pages/auth/SignIn.jsx'
import SignUp from './pages/auth/SignUp.jsx'
import Dashboard from './pages/app/Dashboard.jsx'
import Markets from './pages/app/Markets.jsx'
import Stock from './pages/app/Stock.jsx'
import Orders from './pages/app/Orders.jsx'
import FixedIncome from './pages/app/FixedIncome.jsx'
import Dividends from './pages/app/Dividends.jsx'
import Funding from './pages/app/Funding.jsx'
import Settings from './pages/app/Settings.jsx'
import Support from './pages/app/Support.jsx'
import Notifications from './pages/app/Notifications.jsx'
import LendDashboard from './pages/lend/Dashboard.jsx'
import Start from './pages/lend/Start.jsx'
import Build from './pages/lend/Build.jsx'
import Review from './pages/lend/Review.jsx'
import Documents from './pages/lend/Documents.jsx'
import LendLearn from './pages/lend/Learn.jsx'
import Overview from './pages/admin/Overview.jsx'
import OrderDesk from './pages/admin/OrderDesk.jsx'
import Users from './pages/admin/Users.jsx'
import Claims from './pages/admin/Claims.jsx'
import Lending from './pages/admin/Lending.jsx'
import Compliance from './pages/admin/Compliance.jsx'
import AdminSettings from './pages/admin/Settings.jsx'
import Audit from './pages/admin/Audit.jsx'

function RequireAuth({ children, admin }) {
  const { state } = useStore()
  const loc = useLocation()
  if (!state.auth.signedIn) return <Navigate to={`/signin?${admin ? 'staff=1&' : ''}next=${encodeURIComponent(loc.pathname)}`} replace />
  if (admin && !state.auth.admin) return <Navigate to={`/signin?staff=1&next=${encodeURIComponent(loc.pathname)}`} replace />
  return children
}

function ScrollTop() {
  const { pathname } = useLocation()
  React.useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export function AppRoutes() {
  return (
    <>
        <ScrollTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/check" element={<Check />} />
            <Route path="/invest" element={<Invest />} />
            <Route path="/borrow" element={<Borrow />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/learn" element={<Learn />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/app" element={<RequireAuth><AppShell /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="markets" element={<Markets />} />
            <Route path="stock/:ticker" element={<Stock />} />
            <Route path="orders" element={<Orders />} />
            <Route path="fixed-income" element={<FixedIncome />} />
            <Route path="dividends" element={<Dividends />} />
            <Route path="funding" element={<Funding />} />
            <Route path="settings" element={<Settings />} />
            <Route path="support" element={<Support />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route path="/lend" element={<RequireAuth><LendShell /></RequireAuth>}>
            <Route index element={<LendDashboard />} />
            <Route path="start" element={<Start />} />
            <Route path="build" element={<Build />} />
            <Route path="review" element={<Review />} />
            <Route path="documents" element={<Documents />} />
            <Route path="learn" element={<LendLearn />} />
          </Route>
          <Route path="/admin" element={<RequireAuth admin><AdminShell /></RequireAuth>}>
            <Route index element={<Overview />} />
            <Route path="orders" element={<OrderDesk />} />
            <Route path="users" element={<Users />} />
            <Route path="claims" element={<Claims />} />
            <Route path="lending" element={<Lending />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="audit" element={<Audit />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  )
}
