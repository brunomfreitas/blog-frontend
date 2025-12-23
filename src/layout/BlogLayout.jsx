// src/layout/BlogLayout.jsx
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppAppBar from './AppAppBar';
import Footer from './Footer';

export default function BlogLayout() {
  return (
    <>      
	  <AppAppBar />
	  <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 4, gap: 4 }}
      >
          <Outlet />
      </Container>
      <Footer />  
    </>
  );
}
