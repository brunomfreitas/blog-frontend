// src/App.jsx
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './auth/ProtectedRoute';
import BlogLayout from './layout/BlogLayout';
import AdminPostForm from './pages/Admin/AdminPostForm';
import AdminPostsList from './pages/Admin/AdminPostsList';
import SignIn from './pages/Auth/Login';
import HomePage from './pages/Public/HomePage';
import PostPubic from './pages/Public/PostPublic';
import PostPublicView from './pages/Public/PostPublicView';

export default function App() {
  return (
    <Routes>
      {/* 👇 Login FORA do layout */}
      <Route path="/login" element={<SignIn />} />

      {/* 👇 Tudo aqui dentro usa AppAppBar + Container + Footer */}
      <Route element={<BlogLayout />}>
        {/* Público */}
        <Route path="/" element={<HomePage />} />
        <Route path="/blog/:id" element={<PostPublicView />} />		
        <Route path="/posts" element={<PostPubic />} />
		

        {/* Admin */}
        <Route
          path="/admin/posts"
          element={
            <ProtectedRoute onlyTeacher>
              <AdminPostsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts/novo"
          element={
            <ProtectedRoute onlyTeacher>
              <AdminPostForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts/:id/editar"
          element={
            <ProtectedRoute onlyTeacher>
              <AdminPostForm />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
