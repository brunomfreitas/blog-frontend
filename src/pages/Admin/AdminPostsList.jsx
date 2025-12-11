// src/pages/Admin/AdminPostsList.jsx
import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import BlogLayout from '../../components/Layout/BlogLayout';
import { deletePost, getAdminPosts } from '../../services/postsService';

export default function AdminPostsList() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  async function loadPosts() {
    const data = await getAdminPosts(token);
    setPosts(data);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(id) {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      await deletePost(token, id);
      loadPosts();
    }
  }

  return (
    <BlogLayout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Postagens (Admin)</h2>
        <Button variant="contained" onClick={() => navigate('/admin/posts/novo')}>
          Novo Post
        </Button>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Autor</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.authorName}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/admin/posts/${post.id}/editar`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(post.id)}
                  >
                    Excluir
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </BlogLayout>
  );
}
