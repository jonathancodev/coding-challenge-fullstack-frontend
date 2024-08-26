import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { post } from '../../common/client/fetchApi';
import { saveOnStorage } from '../../common/misc/utils';

export default function LoginForm() {
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    username: Yup
    .string()
    .required('Please enter your username')
    .max(50, 'Username too long'),
    password: Yup
    .string()
    .required('Please enter your password')
    .max(255, 'Password too long')
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: schema,
    onSubmit: async (values) => {
        const data = await post('/auth/login', values);

        if (data) {
          saveOnStorage('jwtToken', data.token);
          navigate('/');
        }
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <>
      <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ my: 2 }}>
              <TextField
                fullWidth
                type="text"
                label="Username"
                {...getFieldProps('username')}
                error={Boolean(touched.username && errors.username)}
                helperText={touched.username && errors.username}
              />

              <TextField
                fullWidth
                type="password"
                label="Password"
                {...getFieldProps('password')}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
            </Stack>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Login
            </LoadingButton>
          </Form>
        </FormikProvider>
      </>
  );
}
