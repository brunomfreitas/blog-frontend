// src/pages/Public/HomePage.jsx
import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import BlogLayout from '../../components/layout/BlogLayout';
import PostCard from '../../components/posts/PostCard';
import { getPublicPosts } from '../../services/postsService';

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getPublicPosts();
        setPosts(data); // espera [{ id, title, description, image, date, author }]
      } catch (error) {
        console.error('Erro ao carregar posts', error);
      }
    }

    loadPosts();
  }, []);

  return (
    <BlogLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        Postagens Recentes
      </Typography>

      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item key={post.id} xs={12} md={6}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
    </BlogLayout>
  );
}
