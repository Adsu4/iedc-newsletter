import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import TopStories from './pages/TopStories';
import ComingUpPage from './pages/ComingUpPage';
import OpportunityRadarPage from './pages/OpportunityRadarPage';
import Archive from './pages/Archive';
import Projects from './pages/Projects';
import About from './pages/About';
import ArticleDetail from './pages/ArticleDetail';
import Unsubscribe from './pages/Unsubscribe';
import SubmitProject from './pages/SubmitProject';

// ⚡ Code Splitting (L5): Lazy load admin pages to keep the public bundle fast and lightweight
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminArticles = lazy(() => import('./pages/AdminArticles'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/top-stories" element={<TopStories />} />
              <Route path="/coming-up" element={<ComingUpPage />} />
              <Route path="/opportunities" element={<OpportunityRadarPage />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/submit-project" element={<SubmitProject />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/about" element={<About />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
            </Route>
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="/admin/articles" element={<AdminArticles />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/dashboard/:articleId" element={<AdminDashboard />} />
              <Route path="/admin/article/:articleId" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
