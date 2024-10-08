import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { LoadingButton } from '@mui/lab';
import { get, post } from '../../common/client/fetchApi';
import { errorMessage } from '../../common/misc/utils';
import Navbar from '../../layouts/Navbar';
import { ContentStyle } from '../../layouts/MainLayout';

function ExecuteOperationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [updateBalance, setUpdateBalance] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [operationTypes, setOperationTypes] = useState([]);
  const [result, setResult] = useState(null);

  const schema = Yup.object().shape({
    operationType: Yup.string()
      .required('Please select operation type'),

    operandOne: Yup
      .number()
      .nullable()
      .typeError('Please enter a valid number'),

    operandTwo: Yup
      .number()
      .nullable()
      .typeError('Please enter a valid number'),
  });

  const fetchOperationTypes = async () => {
    const response = await get(`/operations`);

    if (response) {
      const data = await response.json();
      setOperationTypes(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setTransactionId(uuidv4());
    fetchOperationTypes();
  }, []);

  const formik = useFormik({
    initialValues: {
      operationType: '',
      operandOne: '',
      operandTwo: ''
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setResult(null);
      if (values.operationType !== 'RANDOM_STRING' && (values.operandOne === null || values.operandOne === undefined || values.operandOne === '')) {
        if (values.operationType === 'SQUARE_ROOT') {
          errorMessage('Operand one is required for SQUARE_ROOT');
        } else {
          errorMessage('Operand one is required');
        }
        setSubmitting(false);
        return;
      }

      if (
        values.operationType !== 'RANDOM_STRING' &&
        values.operationType !== 'SQUARE_ROOT' &&
        (values.operandTwo === null || values.operandTwo === undefined || values.operandTwo === '')
      ) {
        errorMessage('Operand two is required');
        setSubmitting(false);
        return;
      }

      const body = {
        transactionId,
        operationType: values.operationType,
        operands: [+values.operandOne, +values.operandTwo]
      };

      const response = await post('/operations', body);

      if (response) {
        const data = await response.json();
        setResult(data.result);
        setUpdateBalance(!updateBalance);
      }

      setSubmitting(false);
    }
  });

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

  return (
    <>
      <Navbar refreshBalance={updateBalance}/>
      <Container maxWidth="sm">
        <ContentStyle>
          <>
            <Stack sx={{ mb: 5 }}>
              <Typography variant="h4" gutterBottom>
              Execute Operation
              </Typography>
            </Stack>
            <FormikProvider value={formik}>
              <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {operationTypes && <TextField
                      select
                      fullWidth
                      label='Operation'
                      {...getFieldProps('operationType')}
                      error={Boolean(touched.operationType && errors.operationType)}
                      helperText={touched.operationType && errors.operationType}
                    >
                      {operationTypes.map(ot => {
                        return (
                          <MenuItem key={ot.id} value={ot.operationType}>{`${ot.operationType} - \$${ot.cost}`}</MenuItem>
                        )
                      })
                      }
                    </TextField>
                    }

                  </Stack>

                  {formik.values.operationType !== 'RANDOM_STRING' && 
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        type='number'
                        label=' Operand One'
                        {...getFieldProps('operandOne')}
                        error={Boolean(touched.operandOne && errors.operandOne)}
                        helperText={touched.operandOne && errors.operandOne}
                      />
                    </Stack>
                  }

                  {formik.values.operationType !== 'RANDOM_STRING' && formik.values.operationType !== 'SQUARE_ROOT' && 
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        type='number'
                        label=' Operand Two'
                        {...getFieldProps('operandTwo')}
                        error={Boolean(touched.operandTwo && errors.operandTwo)}
                        helperText={touched.operandTwo && errors.operandTwo}
                      />
                    </Stack>
                  }

                  {result && 
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Typography>
                        Result: {result}
                      </Typography>
                    </Stack>
                  }

                  <LoadingButton
                    fullWidth
                    size='large'
                    type='submit'
                    variant='contained'
                    loading={isSubmitting}
                  >
                    Execute
                  </LoadingButton>

                  <Button
                    fullWidth
                    color={'secondary'}
                    size='large'
                    type='button'
                    variant='contained'
                    onClick={() => navigate('/')}
                  >
                    Back
                  </Button>

                </Stack>
              </Form>
            </FormikProvider>
          </>
        </ContentStyle>
      </Container>
    </>
  );
}

export default ExecuteOperationForm;
