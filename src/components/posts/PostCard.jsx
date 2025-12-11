// src/components/posts/PostCard.jsx
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        {post.image && (
          <CardMedia
            component="img"
            height="200"
            image={post.image}
            alt={post.title}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h6" component="h2">
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
