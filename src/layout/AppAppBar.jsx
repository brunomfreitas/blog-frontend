import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { alpha, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Sitemark from '../layout/SitemarkIcon';


const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const toggleMobile = () => setMobileOpen((v) => !v);
  const closeMobile = () => setMobileOpen(false);

  const go = (path) => {
    navigate(path);
    closeMobile();
  };

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate('/');
  };

  return (
    <>
      <AppBar
        position="fixed"
        enableColorOnDark
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 'calc(var(--template-frame-height, 0px) + 28px)',
        }}
      >
        <Container maxWidth="lg">
          <StyledToolbar variant="dense" disableGutters>
            {/* Left: Logo + Desktop menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Sitemark />

              {/* Desktop menu */}
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button variant="text" color="info" size="small" onClick={() => go('/')}>
                    Blog
                  </Button>

                  {user ? (
                    <>
                      <Button size="small" onClick={() => go('/admin/posts')}>
                        Administração de Postagens
                      </Button>
                      <Button size="small" onClick={() => go('/admin/posts/novo')}>
                        Novo Post
                      </Button>
                    </>
                  ) : null}
                </Stack>
              </Box>
            </Box>

            {/* Right: Desktop actions */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              {!user ? (
                <Button variant="contained" size="small" onClick={() => go('/login')}>
                  Login
                </Button>
              ) : (
                <Button color="error" variant="text" size="small" onClick={handleLogout}>
                  Logout
                </Button>
              )}
              
            </Box>

            {/* Mobile actions: theme + hamburger */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, alignItems: 'center' }}>
              
              <IconButton onClick={toggleMobile} aria-label="Abrir menu">
                <MenuIcon />
              </IconButton>
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobile}
        PaperProps={{ sx: { width: 300 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Menu
          </Typography>

          <List sx={{ p: 0 }}>
            <ListItemButton onClick={() => go('/')}>
              <ListItemText primary="Blog" />
            </ListItemButton>

            {!user ? (
              <ListItemButton onClick={() => go('/login')}>
                <ListItemText primary="Login" />
              </ListItemButton>
            ) : (
              <>
                <ListItemButton onClick={() => go('/admin/posts')}>
                  <ListItemText primary="Administração de Postagens" />
                </ListItemButton>
                <ListItemButton onClick={() => go('/admin/posts/novo')}>
                  <ListItemText primary="Novo Post" />
                </ListItemButton>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Spacer para não cobrir conteúdo (AppBar fixed) */}
      <Box sx={{ height: { xs: 88, md: 96 } }} />
    </>
  );
}
