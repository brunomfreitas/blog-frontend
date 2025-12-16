import { Box, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../services/postsService';

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
        console.error('❌ Erro ao carregar post:', e);
        setError('Não foi possível carregar o post.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Box sx={{ p: 2 }}>Carregando...</Box>;
  if (error) return <Box sx={{ p: 2, color: 'error.main' }}>{error}</Box>;
  if (!post) return <Box sx={{ p: 2 }}>Post não encontrado.</Box>;

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

  const normalizePost = (p) => {
	
	console.log('p', p);

    // comentado para gerar imagens aleatórias
    const img = // p?.image
    	"https://picsum.photos/800/450?random=" + (p?.id ?? Math.floor(Math.random() * 1000));

	const tag = p?.postCategory?.name ?? "Geral";
	const title = p?.title ?? p?.nm_title ?? p?.titulo ?? "Sem título";
    const description = p?.subtitle;
	const message = p?.message;
	
    const authors = [
      {
        name: p?.postedByPerson?.name ?? "Autor Desconhecido",
        avatar: p?.author?.avatar ?? "",
      },
    ];

    const date = p?.postedAt ?? null;
	
    return { img, tag, title, description, message, authors, date };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    	  
	  <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 4,
          overflow: 'auto',
        }}
      > 
      </Box>
		<Grid container spacing={2} columns={12}>
		{[post].map((p, index) => {
			const card = normalizePost(p);
			return (
			<Grid key={p?.id ?? index} size={{ xs: 12 }}>
				<StyledCard
				variant="outlined"
				tabIndex={0}
				className={"Mui-focused"}
				onClick={() => console.log("clicou no post:", p)}
				>
				<CardMedia
					component="img"
					alt={card.title}
					image={card.img}
					sx={{
					aspectRatio: "16 / 9",
					borderBottom: "1px solid",
					borderColor: "divider",
					}}					
				/>
				<StyledCardContent>
					<Typography gutterBottom variant="caption" component="div">
					{card.tag}
					</Typography>

					<Typography gutterBottom variant="h6" component="div">
					{card.title}
					</Typography>

					<StyledTypography variant="body2" color="text.secondary" gutterBottom >
					{card.description}
					</StyledTypography>

					<StyledTypography variant="body2" color="text.secondary" gutterBottom >
					{card.message}
					</StyledTypography>


				</StyledCardContent>

				{/* <Author authors={card.authors} date={card.date} /> */}
				</StyledCard>
			</Grid>
			);
		})}
		</Grid>
	</Box>
  );
}
