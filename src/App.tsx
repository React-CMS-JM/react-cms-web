import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import { AuthProvider } from './context/AuthContext';
import { LocaleProvider } from './context/LocaleContext';
import { SiteSeo } from './components/layout/SiteSeo';
import { RequirePermission } from './components/auth/RequirePermission';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { PagesList } from './pages/admin/PagesList';
import { PageEditor } from './pages/admin/PageEditor';
import { PostsList } from './pages/admin/PostsList';
import { PostEditor } from './pages/admin/PostEditor';
import { CoursesList } from './pages/admin/CoursesList';
import { CourseEditor } from './pages/admin/CourseEditor';
import { ServicesAdminList } from './pages/admin/ServicesList';
import { ServiceEditor } from './pages/admin/ServiceEditor';
import { ProductsAdminList } from './pages/admin/ProductsList';
import { ProductEditor } from './pages/admin/ProductEditor';
import { CategoriesPage } from './pages/admin/CategoriesPage';
import { TagsPage } from './pages/admin/TagsPage';
import { CommentsModeration } from './pages/admin/CommentsModeration';
import { UsersList } from './pages/admin/UsersList';
import { RolesPermissions } from './pages/admin/RolesPermissions';
import { Settings } from './pages/admin/Settings';
import { HomePage } from './pages/public/HomePage';
import { BlogList } from './pages/public/BlogList';
import { BlogPostView } from './pages/public/BlogPostView';
import { CoursesList as PublicCoursesList } from './pages/public/CoursesList';
import { CourseView } from './pages/public/CourseView';
import { LessonView } from './pages/public/LessonView';
import { ServicesList } from './pages/public/ServicesList';
import { ServiceView } from './pages/public/ServiceView';
import { ProductsList } from './pages/public/ProductsList';
import { ProductView } from './pages/public/ProductView';
import { StaticPageView } from './pages/public/StaticPageView';
import { LoginPage } from './pages/public/LoginPage';
import { Forbidden } from './pages/public/Forbidden';

export function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <ContentProvider>
          <SiteSeo />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesList />} />
            <Route path="/services/:slug" element={<ServiceView />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/:slug" element={<ProductView />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPostView />} />
            <Route path="/courses" element={<PublicCoursesList />} />
            <Route path="/courses/:slug" element={<CourseView />} />
            <Route path="/courses/:slug/:lessonSlug" element={<LessonView />} />
            <Route path="/page/:slug" element={<StaticPageView />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forbidden" element={<Forbidden />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />

              <Route
                path="posts"
                element={
                  <RequirePermission anyOf={['content:edit_all', 'content:publish']}>
                    <PostsList />
                  </RequirePermission>
                }
              />
              <Route
                path="posts/:id"
                element={
                  <RequirePermission anyOf={['content:edit_all', 'content:publish', 'content:create']}>
                    <PostEditor />
                  </RequirePermission>
                }
              />

              <Route
                path="pages"
                element={
                  <RequirePermission anyOf={['content:edit_all', 'content:publish']}>
                    <PagesList />
                  </RequirePermission>
                }
              />
              <Route
                path="pages/:id"
                element={
                  <RequirePermission anyOf={['content:edit_all', 'content:publish', 'content:create']}>
                    <PageEditor />
                  </RequirePermission>
                }
              />

              <Route
                path="services"
                element={
                  <RequirePermission anyOf={['content:edit_all', 'content:publish']}>
                    <ServicesAdminList />
                  </RequirePermission>
                }
              />
              <Route
                path="services/:id"
                element={
                  <RequirePermission anyOf={['content:edit_all', 'content:publish', 'content:create']}>
                    <ServiceEditor />
                  </RequirePermission>
                }
              />

              <Route
                path="products"
                element={
                  <RequirePermission anyOf={['content:edit_all', 'content:publish']}>
                    <ProductsAdminList />
                  </RequirePermission>
                }
              />
              <Route
                path="products/:id"
                element={
                  <RequirePermission anyOf={['content:edit_all', 'content:publish', 'content:create']}>
                    <ProductEditor />
                  </RequirePermission>
                }
              />

              <Route
                path="courses"
                element={
                  <RequirePermission anyOf={['content:create', 'content:edit_all']}>
                    <CoursesList />
                  </RequirePermission>
                }
              />
              <Route
                path="courses/:id"
                element={
                  <RequirePermission anyOf={['content:create', 'content:edit_all']}>
                    <CourseEditor />
                  </RequirePermission>
                }
              />

              <Route
                path="categories"
                element={
                  <RequirePermission anyOf={['content:edit_all']}>
                    <CategoriesPage />
                  </RequirePermission>
                }
              />
              <Route
                path="tags"
                element={
                  <RequirePermission anyOf={['content:edit_all']}>
                    <TagsPage />
                  </RequirePermission>
                }
              />

              <Route
                path="comments"
                element={
                  <RequirePermission anyOf={['comment:moderate']}>
                    <CommentsModeration />
                  </RequirePermission>
                }
              />

              <Route
                path="users"
                element={
                  <RequirePermission anyOf={['user:ban']}>
                    <UsersList />
                  </RequirePermission>
                }
              />
              <Route
                path="roles"
                element={
                  <RequirePermission anyOf={['user:ban']}>
                    <RolesPermissions />
                  </RequirePermission>
                }
              />
              <Route
                path="settings"
                element={
                  <RequirePermission anyOf={['user:ban']}>
                    <Settings />
                  </RequirePermission>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        </ContentProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}
