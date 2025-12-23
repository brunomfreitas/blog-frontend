import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import * as React from 'react';

function Author({ author, date }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
      >
        <AvatarGroup max={3}>          
            <Avatar              
              alt={author}
              sx={{ width: 24, height: 24 }}
            />          
        </AvatarGroup>
        <Typography variant="caption">
          {author}
        </Typography>
      </Box>
      <Typography variant="caption">{format(new Date(date), 'dd/MM/yyyy HH:mm')}</Typography>
    </Box>
  );
}

import { useParams } from 'react-router-dom';
import { getPostById } from '../../services/postsService';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  borderRadius: theme.spacing(1.5),
}));

const ContentWrapper = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5),
  },
}));


export default function PostPublicView() {
  const { id } = useParams();

  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        setError('');
        const resp = await getPostById(id);
        setPost(resp);
      } catch (e) {
        setError('Não foi possível carregar o post.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Box sx={{ p: 2 }}>Carregando...</Box>;
  if (error) return <Box sx={{ p: 2, color: 'error.main' }}>{error}</Box>;
  if (!post) return <Box sx={{ p: 2 }}>Post não encontrado.</Box>;
  
  const image = post.image ?? 'https://picsum.photos/1200/600?random=' + (post?.id ?? Math.floor(Math.random() * 1000));
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
		flexDirection: 'column',
        px: 2,
        py: 4,
      }}
    >
		<Box sx={{ mb: 2 }}>
			<Typography variant="h6" gutterBottom>
				Boa leitura ! Este conteúdo foi preparado por professores para apoiar seus estudos.
			</Typography>
			<Typography variant="subtitle1" gutterBottom >
				Para voltar ao início, clique em “Início” no menu superior.
			</Typography>		
      </Box>
		
      {/* <Box sx={{ width: '100%', maxWidth: 960 }}> */}
		
        <StyledCard elevation={0}>
          {/* 🔝 IMAGEM NO TOPO */}
          <CardMedia
            component="img"
            image={image}
            alt={post.title}
            sx={{
              height: { xs: 220, md: 360 },
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />

          <ContentWrapper>
            {/* Categoria */}
            <Typography
              variant="overline"
              sx={{ fontSize: 14, letterSpacing: 1 }}
              color="text.secondary"
            >
              {post?.postCategory?.name ?? 'Geral'}
            </Typography>

            {/* Título */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
              }}
			  align="justify"
            >
              {post.title}
            </Typography>

            {/* Subtítulo */}
            {post.subtitle && (
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.15rem',
                  lineHeight: 1.6,
                  color: 'text.secondary',
                }}
				align="justify"
              >
                {post.subtitle}
              </Typography>
            )}

            {/* Conteúdo */}
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.05rem',
                lineHeight: 1.8,
                mt: 2,
                whiteSpace: 'pre-line',
              }}
			  align="justify"
            >
              {post.message}
            </Typography>
          </ContentWrapper>
		  <Author author={post.postedByPerson.name} date={post.postedAt} />

        </StyledCard>
      {/* </Box> */}
    </Box>
  );
}
