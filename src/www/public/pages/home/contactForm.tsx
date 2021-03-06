// React
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Button, Grid } from '@mui/material';

import {
  formStyles,
  GetFormikFields,
} from '../../../components/formik'

import { Typography } from '@mui/material'

import * as Yup from 'yup'
import { validationMessages } from '../../../../constants/formik'
import { UsersApi } from '../../../../_api';
import { getConfiguration } from '../../../../config/api.config';
import { toastActions } from '../../../../_actions';

export const validationSchema = Yup.object({
  name: Yup.string()
    .required(validationMessages.required)
    .min(5, validationMessages.minLength.replace('$', '5')),
  email: Yup.string()
    .email(validationMessages.email)
    .required(validationMessages.required),
  subject: Yup.string()
    .required(validationMessages.required)
    .min(5, validationMessages.minLength.replace('$', '5')),
  description: Yup.string()
    .required(validationMessages.required)
    .min(5, validationMessages.minLength.replace('$', '5'))
})

export const initialValues = {
  name: '',
  email: '',
  subject: '',
  description: '',
}

export const formFields = {
  name: 'Nombre y apellido',
  email: 'Correo electrónico',
  subject: 'Asunto',
  description: {
    label: 'Consulta',
    type: 'multiline',
    maxRows: 4,
    required: true
  }
}

export function ContactForm(): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const classes = formStyles()
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const auth = new UsersApi(getConfiguration())

      setLoading(true);

      try {
        await auth.contactFormMailUsers(values)
        dispatch(toastActions.success("Consulta enviada!"))
        formik.resetForm(undefined)
      } catch (error) {
        dispatch(toastActions.error("No se ha podido enviar la consulta, intente nuevamente!"))
      }
      finally {
        setLoading(false);
      }
    },
  })

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()

    const errors = await formik.validateForm();

    formik.setErrors(errors);

    if (!formik.isValid || Object.keys(errors).length > 0) {
      return;
    }

    formik.submitForm()
  }

  const formikFields = GetFormikFields(formik, formFields)

  return (
    <Box
      sx={{ display: 'flex', flexDirection: "column", overflow: 'hidden', width: "80%", mx: "auto" }}
    >
      <Typography
        color="primary"
        align="center"
        variant="h4"
        sx={{ mb: 5, mt: 0, display: "block", fontSize: "36px", fontWeight: "500" }}
      >
        CONTACTO
      </Typography>

      <Grid container columnSpacing={10}>
        <Grid item xs={12} md={6}>

          <form className={classes.form} noValidate>
            {formikFields}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
              onClick={(e) => handleSubmit(e)}
            >
              Enviar consulta
            </Button>
          </form>
        </Grid>
        <Grid item xs={12} md={6}>

          <div style={{marginTop: "32px"}}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1660.6031332382947!2d-63.55193962374905!3d8.141924059249678!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x5a78554099f377b2!2sInstituto%20Universitario%20de%20Tecnolog%C3%ADa%20del%20Estado%20Bol%C3%ADvar%20(IUTEB)!5e0!3m2!1ses!2sar!4v1642366528821!5m2!1ses!2sar" width="100%" height="440" style={{ border: "0" }} allowFullScreen={false} loading="lazy"></iframe>
          </div>
        </Grid>
      </Grid>
    </Box>
  )
}
