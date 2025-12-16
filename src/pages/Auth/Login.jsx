// src/pages/Auth/Login.jsx
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import Sitemark from '../../layout/SitemarkIcon';
import AppTheme from '../../theme/AppTheme';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn(props) {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [loginValue, setLoginValue] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loginError, setLoginError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState('');

  const validateInputs = () => {
    let ok = true;

    if (!loginValue.trim()) {
      setLoginError('Informe o login.');
      ok = false;
    } else {
      setLoginError('');
    }

    if (!password || password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.');
      ok = false;
    } else {
      setPasswordError('');
    }

    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateInputs()) return;

    try {
      setSubmitting(true);

      // ✅ Esse login atualiza token/user no AuthContext e no localStorage
      await authLogin(loginValue, password);

      // ✅ navega só depois que o contexto já foi atualizado
      navigate('/admin/posts', { replace: true });
    } catch (err) {
      console.error('❌ login error', err);
      setFormError('Login inválido ou erro ao autenticar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Sitemark />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="login">Login</FormLabel>
              <TextField
                id="login"
                name="login"
                type="text"                
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                error={!!loginError}
                helperText={loginError}
                autoFocus
                required
                fullWidth
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Senha</FormLabel>
              <TextField
                id="password"
                name="password"
                placeholder="••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                required
                fullWidth
              />
            </FormControl>
            {formError ? (
              <Typography variant="body2" color="error">
                {formError}
              </Typography>
            ) : null}
            <Button type="submit" fullWidth variant="contained" disabled={submitting}>
              {submitting ? 'Acessando' : 'Acessar'}
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
