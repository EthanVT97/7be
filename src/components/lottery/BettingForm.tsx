import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  number: yup
    .string()
    .required('ထီဂဏန်း ထည့်သွင်းပါ')
    .matches(/^\d+$/, 'ဂဏန်းများသာ ထည့်သွင်းပါ'),
  amount: yup
    .number()
    .required('ငွေပမာဏ ထည့်သွင်းပါ')
    .min(100, 'အနည်းဆုံး ၁၀၀ ကျပ်')
    .max(1000000, 'အများဆုံး ၁၀သိန်း'),
});

const BettingForm: React.FC = () => {
  const [lotteryType, setLotteryType] = useState<'2D' | '3D'>('2D');
  const [timeSlot, setTimeSlot] = useState<'morning' | 'evening'>('morning');

  const formik = useFormik({
    initialValues: {
      number: '',
      amount: '',
    },
    validationSchema,
    onSubmit: (values) => {
      // TODO: Implement betting logic
      console.log({ ...values, lotteryType, timeSlot });
    },
  });

  const handleLotteryTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: '2D' | '3D',
  ) => {
    if (newType !== null) {
      setLotteryType(newType);
      formik.setFieldValue('number', '');
    }
  };

  const handleTimeSlotChange = (
    _event: React.MouseEvent<HTMLElement>,
    newSlot: 'morning' | 'evening',
  ) => {
    if (newSlot !== null) {
      setTimeSlot(newSlot);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            ထီထိုးမည်
          </Typography>

          <Box sx={{ mb: 3 }}>
            <ToggleButtonGroup
              value={lotteryType}
              exclusive
              onChange={handleLotteryTypeChange}
              fullWidth
              sx={{ mb: 2 }}
            >
              <ToggleButton value="2D">၂ လုံး</ToggleButton>
              <ToggleButton value="3D">၃ လုံး</ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              value={timeSlot}
              exclusive
              onChange={handleTimeSlotChange}
              fullWidth
            >
              <ToggleButton value="morning">မနက်ပိုင်း</ToggleButton>
              <ToggleButton value="evening">ညနေပိုင်း</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="number"
                  name="number"
                  label={`${lotteryType} ဂဏန်း`}
                  value={formik.values.number}
                  onChange={formik.handleChange}
                  error={formik.touched.number && Boolean(formik.errors.number)}
                  helperText={formik.touched.number && formik.errors.number}
                  inputProps={{
                    maxLength: lotteryType === '2D' ? 2 : 3,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="amount"
                  name="amount"
                  label="ငွေပမာဏ"
                  type="number"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                {lotteryType === '2D' ? '၂ လုံး' : '၃ လုံး'} {timeSlot === 'morning' ? 'မနက်ပိုင်း' : 'ညနေပိုင်း'}{' '}
                ထီပိတ်ချိန် {timeSlot === 'morning' ? '၁၁:၅၀' : '၄:၃၀'}
              </Alert>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                ထိုးမည်
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default BettingForm; 