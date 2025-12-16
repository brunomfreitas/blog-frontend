// src/pages/Public/PostDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogLayout from '../../layout/BlogLayout';
import { getPublicPosts } from '../../services/postsService';

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPublicPosts();
        setPost(data);
      } catch (err) {
        console.error('Erro ao carregar post', err);
      }
    }
    loadPost();
  }, [id]);

  if (!post) {
    return (
      <BlogLayout>
        <h2>Carregando...</h2>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <h1>{post.title}</h1>
      <p>{post.description}</p>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          style={{ width: '100%', borderRadius: 8, marginTop: 20 }}
        />
      )}

      <div style={{ marginTop: 20 }}>
        <p><strong>Autor:</strong> {post.authorName}</p>
        <p><strong>Data:</strong> {post.date}</p>
      </div>
    </BlogLayout>
  );
}
