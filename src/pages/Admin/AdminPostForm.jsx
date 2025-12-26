// src/pages/Admin/AdminPostForm.jsx
import {
	Autocomplete,
	Box,
	Button,
	CircularProgress,
	Divider,
	Grid,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../../auth/AuthContext';
import { getCategories } from '../../services/categoryService';
import { createPost, getPostById, updatePost } from '../../services/postsService';
import { getPostStatus } from '../../services/postStatusService';

function toDatetimeLocal(value) {
  if (!value) return '';
  const d = new Date(value);

  const pad = (n) => String(n).padStart(2, '0');

  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}


export default function AdminPostForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // se existir, é edição
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

	// ✅ ajuste aqui conforme o shape do seu /me
	const createdById = user?.personId ?? user?.person?.id ?? user?.id ?? null;
	const postedById = user?.personId ?? user?.person?.id ?? user?.id ?? null;	
  
	const schema = Yup.object({
		title: Yup.string().required('Informe o título.'),
		subtitle: Yup.string().required('Informe o subtítulo.'),
		message: Yup.string().required('Informe a mensagem.'),
		image: Yup.string().url('Informe uma URL válida.').nullable(),
		category: Yup.number().required('Selecione a categoria.'),
		status: Yup.number().required('Selecione o status.'),
		postedAt: Yup.date()
			.nullable()
			.when('status', {
				is: (s) => Number(s) === 7,
				then: (schema) => schema.required('Informe a data da postagem.'),
				otherwise: (schema) => schema.notRequired(),
			}),
	});

  const formik = useFormik({
    initialValues: {
      title: '',
      subtitle: '',
      message: '',
      image: '',
      createdBy: createdById, // ✅ backend espera number	  
      category: '',           // ✅ number
      status: '',             // ✅ number
	  postedBy: postedById	  
    },
    enableReinitialize: true, // importante quando createdById chega depois
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(null);
 
      try {
        // payload exatamente como backend espera
        const payload = {
			title: values.title,
			subtitle: values.subtitle,
			message: values.message,
			image: values.image || null,
			createdBy: Number(values.createdBy),		  
			category: Number(values.category),
			status: Number(values.status),
			...(isEdit && Number(values.status) === 7 && {
				postedBy: Number(values.postedBy ?? postedById),
				postedAt: new Date(values.postedAt).toISOString(),
			}),
        };

        if (isEdit) {
          await updatePost(id, payload);
        } else {
          await createPost(payload);
        }

        navigate('/admin/posts', { replace: true });
      } catch (e) {
        console.error('❌ erro ao salvar post', e);
        setStatus('Não foi possível salvar a postagem.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { values, touched, errors, handleChange, handleBlur, isSubmitting, status, setFieldValue } = formik;

  // helpers pra achar o objeto selecionado no Autocomplete
  const selectedCategory = useMemo(() => categories.find((c) => c.id === Number(values.category)) ?? null, [categories, values.category]);

  const selectedStatus = useMemo(() => statuses.find((s) => s.id === Number(values.status)) ?? null, [statuses, values.status]);
  
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [cats, stats] = await Promise.all([getCategories(), getPostStatus()]);

		setCategories(cats.data);
        setStatuses(stats.data);

        if (isEdit) {
          const post = await getPostById(id);		  
          // Aqui ajusta conforme o retorno do seu backend
          // Pelo seu JSON, tem "category" e "status" como id number.
		  
          formik.setValues({
            title: post.title ?? '',
            subtitle: post.subtitle ?? '',
            message: post.message ?? '',
            image: post.image ?? '',
            createdBy: post.createdBy ?? createdById,			
            category: post.category ?? '',
            status: post.status ?? '',
			postedBy: post.postedBy ?? postedById,
            postedAt: post.postedAt ?? toDatetimeLocal(post.postedAt),
          });
        }
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit, createdById]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }
    
  return (
    <FormikProvider value={formik}>
      <Form noValidate>
        <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {isEdit ? 'Editar Postagem' : 'Nova Postagem'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preencha os campos abaixo para {isEdit ? 'atualizar' : 'criar'} uma postagem.
              </Typography>
            </Box>
            <Divider />
			<Grid container spacing={2}>
  				<Grid item size={12}>
    				<TextField
						name="title"
						label="Título"
						value={values.title}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.title && Boolean(errors.title)}
						helperText={touched.title && errors.title}
						fullWidth
						required
						variant="standard"
					/>
  				</Grid>
  				<Grid size={12}>
    				<TextField
						name="subtitle"
						label="Subtítulo"
						value={values.subtitle}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.subtitle && Boolean(errors.subtitle)}
						helperText={touched.subtitle && errors.subtitle}
						fullWidth
						variant="standard"
            		/>
  				</Grid>
  				<Grid size={12}>
    				<TextField
						name="message"
						label="Mensagem"
						value={values.message}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.message && Boolean(errors.message)}
						helperText={touched.message && errors.message}
						fullWidth
						required
						multiline
						minRows={10}
						variant="standard"
					/>
  				</Grid>
  				<Grid size={12}>
    				<TextField
						name="image"
						label="Imagem (URL)"
						value={values.image}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.image && Boolean(errors.image)}
						helperText={touched.image && errors.image}
						fullWidth
						placeholder="https://..."
						variant="standard"
					/>
  				</Grid>
				<Grid size={6}>
    			{/* Combobox: Category */}
            		<Autocomplete
						options={categories}
						value={selectedCategory}
						getOptionLabel={(opt) => opt?.name ?? ''}
						isOptionEqualToValue={(opt, val) => opt.id === val.id}
						onChange={(_, option) => setFieldValue('category', option?.id ?? '')}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Categoria"
								required
								error={touched.category && Boolean(errors.category)}
								helperText={touched.category && errors.category}
								variant="standard"
							/>
						)}
					/>
  				</Grid>
  				<Grid size={6}>
     				{/* Combobox: Status */}
            		<Autocomplete
						options={statuses}
						value={selectedStatus}
						getOptionLabel={(opt) => opt?.name ?? ''}
						isOptionEqualToValue={(opt, val) => opt.id === val.id}
						onChange={(_, option) => setFieldValue('status', option?.id ?? '')}
						renderInput={(params) => (
							<TextField
							{...params}
							label="Status"
							required
							error={touched.status && Boolean(errors.status)}
							helperText={touched.status && errors.status}
							variant="standard"
							/>
						)}
					/>
  				</Grid>
  				{values.status === 7 &&
				<Grid item size={6}>
					<TextField
						name="postedAt"
						label="Postado Em"
						// value={values.postedAt}
					  	value={toDatetimeLocal(values.postedAt)}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.postedAt && Boolean(errors.postedAt)}
						helperText={touched.postedAt && errors.postedAt}
						fullWidth
						required
						variant="standard"
						type="datetime-local"
					/>
				</Grid>
}
			</Grid>
      
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/admin/posts')}>
                Cancelar
              </Button>

              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando…' : 'Salvar'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Form>
    </FormikProvider>
  );
}
