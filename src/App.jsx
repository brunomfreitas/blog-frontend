// import Container from '@mui/material/Container';
// import CssBaseline from '@mui/material/CssBaseline';
// import AppAppBar from './components/AppAppBar';
// import Footer from './components/Footer';
// import Latest from './components/Latest';
// import MainContent from './components/MainContent';
// import AppTheme from './theme/AppTheme';

// function App(props) {

//   return (
//     <AppTheme {...props}>
//       <CssBaseline enableColorScheme />
//       <AppAppBar />
//       <Container
//         maxWidth="lg"
//         component="main"
//         sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
//       >
//         <MainContent />
//         <Latest />
//       </Container>
//       <Footer />
//     </AppTheme>
//   )
// }

// export default App


// src/App.jsx
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './auth/ProtectedRoute';
import AdminPostForm from './pages/Admin/AdminPostForm';
import AdminPostsList from './pages/Admin/AdminPostsList';
import LoginPage from './pages/Auth/LoginPage';
import HomePage from './pages/Public/HomePage';
import PostDetailPage from './pages/Public/PostDetailPage';

export default function App() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<HomePage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />

      {/* Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin – só professor */}
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
    </Routes>
  );
}
