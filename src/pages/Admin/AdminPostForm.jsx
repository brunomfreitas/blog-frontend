// src/pages/Admin/AdminPostForm.jsx
import { useParams } from 'react-router-dom';

export default function AdminPostForm() {
  const { id } = useParams();

  return (
    <div style={{ padding: 20 }}>
      <h1>{id ? `Editar post ${id}` : 'Criar novo post'}</h1>
      <p>(Depois a gente coloca aqui o formulário com MUI bonitão 😉)</p>
    </div>
  );
}
