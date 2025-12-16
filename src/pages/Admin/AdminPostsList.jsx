// src/pages/Admin/AdminPostsList.jsx
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
	Box,
	Button,
	Chip,
	IconButton,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { deletePost, getAdminPosts } from '../../services/postsService';


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: 700
  }
}));

export default function AdminPostsList() {
  	const [posts, setPosts] = useState([]);
  	const [error, setError] = useState('');
	
	const navigate = useNavigate();
	const { token } = useAuth();

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  	const loadPosts = async() => {
		try {
			setError("");
			const resp = await getAdminPosts(token, 1, 15);
			console.log("resp", resp);
	  		setPosts(Array.isArray(resp) ? resp : (resp?.data ?? []));
  
		} catch (e) {
			console.error("❌ Erro ao carregar posts:", e);
			setError("Não foi possível carregar os posts.");
		    setPosts([]);
		}		
  	}
  	
  	useEffect(() => {
		loadPosts();
	}, []);

  	async function handleDelete(id) {
    	if (!window.confirm('Tem certeza que deseja excluir este post?')) return;

    	try {
      		await deletePost(id); // ✅ correto
      		loadPosts();
    	} catch (e) {
      		console.error(e);
      		setError('Não foi possível excluir a postagem.');
    	}
  	}

  	const total = posts.length;

  // Exemplo simples de badge/status (opcional)
  const renderStatus = (post) => {
    const label = post?.postStatus?.name ?? '—';
    return <Chip size="small" label={label} variant="outlined" />;
  };

  const MobileList = () => (
  <Stack spacing={2}>
    {posts.map((post) => (
      <Card key={post.id} variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700 }} noWrap>
                {post.title}
              </Typography>
              {post.subtitle ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {post.subtitle}
                </Typography>
              ) : null}
            </Box>

            <Box sx={{ flexShrink: 0 }}>
              {renderStatus(post)}
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            <b>Autor:</b> {post.createdByPerson?.name ?? '—'}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={() => navigate(`/admin/posts/${post.id}/editar`)}
              fullWidth
            >
              Editar
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineOutlinedIcon />}
              onClick={() => handleDelete(post.id)}
              fullWidth
            >
              Excluir
            </Button>
          </Stack>
        </CardContent>
      </Card>
    ))}

    {posts.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        Nenhuma postagem encontrada.
      </Typography>
    ) : null}
  </Stack>
);


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header da página */}
      <Stack
		direction={{ xs: 'column', md: 'row' }}
		justifyContent="space-between"
		alignItems={{ xs: 'stretch', md: 'center' }}
		gap={2}
		>
		<Box>
			<Typography variant="h5" sx={{ fontWeight: 700 }}>
			Postagens
			</Typography>
			<Typography variant="body2" color="text.secondary">
			{total} {total === 1 ? 'registro' : 'registros'}
			</Typography>
		</Box>

		<Button
			variant="contained"
			startIcon={<AddOutlinedIcon />}
			onClick={() => navigate('/admin/posts/novo')}
			sx={{ alignSelf: { xs: 'stretch', md: 'auto' } }}
		>
			Novo Post
		</Button>
		</Stack>

      {error ? (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      ) : null}

      {/* Card/Container da tabela */}
      {isMobile ? (
		<MobileList />
		) : (
		<Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
			<TableContainer sx={{ maxHeight: 520 }}>
			<Table stickyHeader aria-label="tabela de postagens">
				<TableHead>
				<TableRow>
					<StyledTableCell>Título</StyledTableCell>
					<StyledTableCell>Autor</StyledTableCell>
					<StyledTableCell>Status</StyledTableCell>
					<StyledTableCell align="right">Ações</StyledTableCell>
				</TableRow>
				</TableHead>

				<TableBody>
				{posts.map((post) => (
					<StyledTableRow key={post.id}>
					<TableCell sx={{ minWidth: 260 }}>
						<Typography sx={{ fontWeight: 600 }}>{post.title}</Typography>
						{post.subtitle ? (
						<Typography variant="body2" color="text.secondary">
							{post.subtitle}
						</Typography>
						) : null}
					</TableCell>

					<TableCell sx={{ whiteSpace: 'nowrap' }}>
						{post.createdByPerson?.name ?? '—'}
					</TableCell>

					<TableCell>{renderStatus(post)}</TableCell>

					<TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
						<Stack direction="row" spacing={1} justifyContent="flex-end">
						<Tooltip title="Editar">
							<IconButton
							size="small"
							onClick={() => navigate(`/admin/posts/${post.id}/editar`)}
							>
							<EditOutlinedIcon fontSize="small" />
							</IconButton>
						</Tooltip>

						<Tooltip title="Excluir">
							<IconButton
							size="small"
							color="error"
							onClick={() => handleDelete(post.id)}
							>
							<DeleteOutlineOutlinedIcon fontSize="small" />
							</IconButton>
						</Tooltip>
						</Stack>
					</TableCell>
					</StyledTableRow>
				))}

				{posts.length === 0 ? (
					<TableRow>
					<TableCell colSpan={4}>
						<Typography variant="body2" color="text.secondary">
						Nenhuma postagem encontrada.
						</Typography>
					</TableCell>
					</TableRow>
				) : null}
				</TableBody>
			</Table>
			</TableContainer>
		</Paper>
		)}

    </Box>
  );
}
