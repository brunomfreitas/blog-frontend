// src/components/layout/BlogLayout.jsx
import { Box, Container } from '@mui/material';
// importe aqui seu Header e Footer copiados do template do blog
// import Header from './Header';
import AppAppBar from '../AppAppBar';
import Footer from '../Footer';

export default function BlogLayout({ children }) {
  return (
    <>
      {/* <Header title="Blog Escola" sections={[...]} /> */}
	  <AppAppBar />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          {children}
        </Box>
      </Container>
      <Footer title="Blog Escola" description="Conteúdos para alunos e professores." />
	  
    </>
  );
}
