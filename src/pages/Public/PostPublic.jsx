import { SearchOutlined } from '@ant-design/icons';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import * as React from 'react';
import { getCategories } from '../../services/categoryService';
import { getPublicPosts, searchPublicPosts } from "../../services/postsService";

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

function Author({ authors, date }) {
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
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(', ')}
        </Typography>
      </Box>
      <Typography variant="caption">{format(new Date(date), 'dd/MM/yyyy HH:mm')}</Typography>
    </Box>
  );
}

Author.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export function Search({ setPosts, onChange }) {
  const [value, setValue] = React.useState('');

  const search = async () => {
    const text = value?.trim() ?? '';
    onChange(null);

    const resp = await searchPublicPosts(text);
    setPosts(resp.data);
  };

  return (
    <FormControl fullWidth variant="outlined">
      <OutlinedInput
        id="pesquisar"
        name="pesquisar"
        placeholder="Pesquisar…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') search();
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton edge="end" color="secondary" onClick={search}>
              <SearchOutlined />
            </IconButton>
          </InputAdornment>
        }
        inputProps={{ 'aria-label': 'search' }}
      />
    </FormControl>
  );
}


export function Categories({ value, onChange }) {
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const resp = await getCategories();       
        setCategories(resp.data);
      } catch (e) {
        console.error("❌ Erro ao carregar categorias:", e);
      }
    })();
  }, []);

  return (
    <>
      <Chip
        clickable
        onClick={() => onChange(null)}   // null = todas
        size="medium"
        label="Todas categorias"
        color={value == null ? 'primary' : 'default'}
        variant={value == null ? 'filled' : 'outlined'}
		sx={{ flexShrink: 0 }}
      />

      {categories.map((cat) => (
        <Chip
		  sx={{ flexShrink: 0 }}
          key={cat.id}
          clickable
          onClick={() => onChange(cat.id)}
          size="medium"
          label={cat.name}
          color={value === cat.id ? 'primary' : 'default'}
          variant={value === cat.id ? 'filled' : 'outlined'}
        />
      ))}
    </>
  );
}

import { useNavigate } from 'react-router-dom';

export default function PostPubic() {
  
	const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);
	const [posts, setPosts] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState("");
	const [selectedCategoryId, setSelectedCategoryId] = React.useState(null);
	const navigate = useNavigate();

	const goToPost = (id) => {
		if (!id) return;
		navigate(`/blog/${id}`);
	};

	React.useEffect(() => {
		(async () => {
		try {
			setLoading(true);
			setError("");

    		const resp = await getPublicPosts(1, 12, selectedCategoryId);
			setPosts(resp.data);

			console.log("✅ Posts carregados:", resp.data);
		} catch (e) {
			console.error("❌ Erro ao carregar posts:", e);
			setError("Não foi possível carregar os posts.");
		} finally {
			setLoading(false);
		}
		})();
	}, [selectedCategoryId]);
  
	const handleFocus = (index) => { setFocusedCardIndex(index); };

	const handleBlur = () => { setFocusedCardIndex(null); };

	const handleCategoryChange = (catId) => {
		setSelectedCategoryId(catId);
	};

  // mapeia o post do backend para o “formato visual” do card
  const normalizePost = (p) => {
	
    const title = p?.title ?? p?.nm_title ?? p?.titulo ?? "Sem título";
    const description = p?.subtitle
	// const description = p?.subtitle ?? p?.dsc_summary ?? p?.description ?? (p?.content ? String(p.content).slice(0, 140) + "…" : "");

    const tag = p?.postCategory?.name ?? "Geral";

	// comentado para gerar imagens aleatórias
    const img = p?.image ??	"https://picsum.photos/800/450?random=" + (p?.id ?? Math.floor(Math.random() * 1000));

    const authors = [
      {
        name: p?.postedByPerson?.name ?? "Autor Desconhecido",
        avatar: p?.author?.avatar ?? "",
      },
    ];

    const date = p?.postedAt ?? null;
	
    return { title, description, tag, img, authors, date };
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
	<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>        
			<Typography variant="h3" gutterBottom>
				Bem-vindo(a) ao Blog Educacional
			</Typography>
			<Typography variant="body1" gutterBottom>
				Aqui você encontrará conteúdos preparados pelos professores para apoiar seus estudos, revisar conceitos importantes e aprofundar seu aprendizado.
			</Typography>
			<Typography variant="body1" gutterBottom >
				Utilize as categorias para explorar os temas ou pesquise diretamente por um assunto de seu interesse.
			</Typography>		
      </div>
		<Box
			sx={{
				display: 'flex',
				flexDirection: { xs: 'column', md: 'row' },
				alignItems: { xs: 'stretch', md: 'center' },
				gap: 2,
				width: '100%',
			}}
		>
			{/* Search - sempre visível */}
			<Box sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0, order: { xs: 0, md: 1 } }}>
				<Search setPosts={setPosts} onChange={handleCategoryChange} />
			</Box>

			{/* Categories - scroll horizontal no mobile */}
			<Box
				sx={{
				display: 'flex',
				gap: 1,
				overflowX: 'auto',
				overflowY: 'hidden',
				width: '100%',
				py: 0.5,
				order: { xs: 1, md: 0 },
				'&::-webkit-scrollbar': { height: 6 },
				'&::-webkit-scrollbar-thumb': { borderRadius: 999 },
				}}
			>
				<Categories value={selectedCategoryId} onChange={handleCategoryChange} />
			</Box>
		</Box>
		<Grid container spacing={2} columns={12}>
			{posts.map((p, index) => {
				const card = normalizePost(p);
				return (
				<Grid key={p?.id ?? index} size={{ xs: 12, md: index < 2 ? 6 : 4 }}>
				{/* <Grid item xs={12} md={index < 2 ? 6 : 4} key={p?.id ?? index}> */}

					<StyledCard
					variant="outlined"
					onFocus={() => handleFocus(index)}
					onBlur={handleBlur}
					tabIndex={0}
					className={focusedCardIndex === index ? "Mui-focused" : ""}
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
						onClick={() => goToPost(p?.id)}
					/>

					<StyledCardContent>
						<Typography gutterBottom variant="caption" component="div">
						{card.tag}
						</Typography>

						<Typography gutterBottom variant="h6" component="div" onClick={() => goToPost(p?.id)}>
						{card.title}
						</Typography>

						<StyledTypography variant="body2" color="text.secondary" gutterBottom onClick={() => goToPost(p?.id)}>
						{card.description}
						</StyledTypography>
					</StyledCardContent>

					<Author authors={card.authors} date={card.date} />
					</StyledCard>
				</Grid>
				);
			})}
		</Grid>
	</Box>
  );
}