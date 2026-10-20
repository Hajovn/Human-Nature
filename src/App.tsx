import { lazy, Suspense, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';

// Routes from DESIGN.md §8.3 #14. Non-landing pages are split into their own chunks.
const ThemePage = lazy(() => import('./pages/ThemePage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const ResourceDetailPage = lazy(() => import('./pages/ResourceDetailPage'));
const MissionPage = lazy(() => import('./pages/MissionPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AuthPlaceholderPage = lazy(() => import('./pages/AuthPlaceholderPage'));
const SimplePage = lazy(() => import('./pages/SimplePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Each page sets its own tab title with useDocumentTitle.
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="themes/:slug" element={<Lazy page={<ThemePage />} />} />
        <Route path="resources" element={<Lazy page={<ResourcesPage />} />} />
        <Route path="resources/:slug" element={<Lazy page={<ResourceDetailPage />} />} />
        <Route path="resources/:slug/test" element={<Lazy page={<ResourceDetailPage startTest />} />} />
        <Route path="mission" element={<Lazy page={<MissionPage />} />} />
        <Route path="profile" element={<Lazy page={<ProfilePage />} />} />
        <Route path="login" element={<Lazy page={<LoginPage />} />} />
        <Route path="register" element={<Lazy page={<AuthPlaceholderPage kind="register" />} />} />
        <Route path="forgot-password" element={<Lazy page={<AuthPlaceholderPage kind="forgot" />} />} />
        <Route path="privacy" element={<Lazy page={<SimplePage title="Privacy" />} />} />
        <Route path="terms" element={<Lazy page={<SimplePage title="Terms of use" />} />} />
        <Route path="*" element={<Lazy page={<NotFoundPage />} />} />
      </Route>
    </Routes>
  );
}

function Lazy({ page }: { page: ReactNode }) {
  // Reserve space while a page chunk loads so the footer doesn't jump up.
  return <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>{page}</Suspense>;
}
