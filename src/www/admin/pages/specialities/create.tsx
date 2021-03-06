// React
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Checkbox, Container, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router'

import {
  formStyles,
} from '../../../components/formik'

import { AdminLayout } from '../../components/adminLayout'
import { initialValues, validationSchema } from './form'

// Variable
import { specialitiesActions as actions, officesActions } from '../../../../_actions'
import { ActionOptions } from '../../../../_actions/generic.actions'

const dispatchOptions: ActionOptions = {
  redirect: '/admin/especialidades'
}

export function CreateSpecialitiesPage(): React.ReactElement {
  // Variable
  const formName = 'Especialidad médica';
  const { loading, data } = useSelector((store: any) => store.specialities)
  const { items = [] } = useSelector((store: any) => store.offices)

  const classes = formStyles()
  const dispatch = useDispatch()

  const params = useParams<{ id?: string | undefined }>()

  // Get offices
  useEffect(() => {
    dispatch(officesActions.getAll({
      limit: 25000,
      offset: 0,
      where: "isActive==1"
    }))
  }, [])

  // Edit listener
  useEffect(() => {
    if (params.id) {
      dispatch(actions.getOne(+params.id))
    }
  }, [params.id])

  // Edit form listener
  useEffect(() => {
    if (data && params.id) {
      formik.setValues({ ...data, officeId: data.office.id })
    }
  }, [data])

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (params.id) {
        dispatch(actions.updateOne(+params.id, values, dispatchOptions))
      } else {
        dispatch(actions.createOne(values, dispatchOptions))
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

  return (
    <AdminLayout>
      <Container>
        <Typography
          component="h1"
          variant="h5"
          style={{
            textAlign: 'center',
          }}
        >
          {data && params.id ? `Actualizar ${formName}` : `Crear ${formName}`}
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="nombre"
            label="Nombre"
            {...formik.getFieldProps("name")}
          />
          <FormHelperText error id="my-helper-text">
            {formik.touched.name && formik.errors.name
              ? formik.errors.name
              : null}
          </FormHelperText>

          <FormControl
            variant="outlined"
            className={classes.formControl}
          >
            <InputLabel className={classes.selectLabel} id='select-oficina'>
              Consultorio médico
            </InputLabel>
            <Select
              labelId='select-oficina'
              label="officeId"
              {...formik.getFieldProps("officeId")}
            >
              <MenuItem value="">
                Seleccionar
              </MenuItem>
              {items?.map((el: any) => {
                return (
                  <MenuItem key={el.name} value={el.id}>
                    {el.name}
                  </MenuItem>
                )
              })}
            </Select>
            <FormHelperText error id="my-helper-text">
              {formik.errors.officeId ? formik.errors.officeId : null}
            </FormHelperText>
          </FormControl>

          <FormControlLabel
            className={classes.formControl}
            control={
              <Checkbox
                color="primary"
                aria-describedby="checkbox-error-text"
                checked={!!formik.values.isActive}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  formik.setFieldValue("isActive", event.target.checked ? 1 : 0)
                }}
              />
            }
            label="¿Está habilitado?"
          />
          <FormHelperText error id="checkbox-error-text">
            {formik.errors.isActive ? formik.errors.isActive : null}
          </FormHelperText>

          <Button
            sx={{ mt: 2 }}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
            onClick={(e) => handleSubmit(e)}
          >
            {data && params.id ? 'Actualizar' : 'Crear'}
          </Button>
        </form>
      </Container>
    </AdminLayout>
  )
}
