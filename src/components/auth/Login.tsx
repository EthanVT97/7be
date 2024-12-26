import React from 'react';
import { TextField, Button, Paper, Typography, Box, Container } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  phone: yup.string().required('ဖုန်းနံပါတ် ထည့်သွင်းပါ'),
  password: yup.string().required('စကားဝှက် ထည့်သွင်းပါ'),
});

const Login: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      phone: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // TODO: Implement login logic
      console.log(values);
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            အကောင့်ဝင်ရန်
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="ဖုန���းနံပါတ်"
              margin="normal"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="စကားဝှက်"
              type="password"
              margin="normal"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              ဝင်ရောက်မည်
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 