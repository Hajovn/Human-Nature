import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';

// Routes from DESIGN.md §8.3 #14, available in Indonesian (/…) and English (/en/…).
// Non-landing pages are split into their own chunks.
const ThemePage = lazy(() => import('./pages/ThemePage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const ResourceDetailPage = lazy(() => import('./pages/ResourceDetailPage'));
const MissionPage = lazy(() => import('./pages/MissionPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));
const SimplePage = lazy(() => import('./pages/SimplePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const pageRoutes = (
  <>
    <Route index element={<LandingPage />} />
    <Route path="themes/:slug" element={<Lazy page={<ThemePage />} />} />
    <Route path="resources" element={<Lazy page={<ResourcesPage />} />} />
    <Route path="resources/:slug" element={<Lazy page={<ResourceDetailPage />} />} />
    <Route path="resources/:slug/test" element={<Lazy page={<ResourceDetailPage />} />} />
    <Route path="glossary" element={<Lazy page={<GlossaryPage />} />} />
    <Route path="mission" element={<Lazy page={<MissionPage />} />} />
    <Route path="profile" element={<Lazy page={<ProfilePage />} />} />
    <Route path="profile/admin" element={<Lazy page={<AdminPage />} />} />
    <Route path="login" element={<Lazy page={<LoginPage />} />} />
    <Route path="register" element={<Lazy page={<RegisterPage />} />} />
    <Route path="forgot-password" element={<Lazy page={<ForgotPasswordPage />} />} />
    <Route path="reset-password" element={<Lazy page={<ResetPasswordPage />} />} />
    <Route path="auth/callback" element={<Lazy page={<AuthCallbackPage />} />} />
    <Route path="privacy" element={<Lazy page={<SimplePage name="privacy" />} />} />
    <Route path="terms" element={<Lazy page={<SimplePage name="terms" />} />} />
    <Route path="*" element={<Lazy page={<NotFoundPage />} />} />
  </>
);

// Each page sets its own tab title with useDocumentTitle.
export function App() {
  return (
    <Routes>
      <Route path="id/*" element={<LegacyIdRedirect />} />
      <Route element={<Layout />}>
        <Route path="en">{pageRoutes}</Route>
        {pageRoutes}
      </Route>
    </Routes>
  );
}

/** Until 2026-10-22 Indonesian lived at /id/…; keep old links working. */
function LegacyIdRedirect() {
  const { pathname, search, hash } = useLocation();
  return <Navigate replace to={`${pathname.slice(3) || '/'}${search}${hash}`} />;
}

function Lazy({ page }: { page: ReactNode }) {
  // Reserve space while a page chunk loads so the footer doesn't jump up.
  return <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>{page}</Suspense>;
}
