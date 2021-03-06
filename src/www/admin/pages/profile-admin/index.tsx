// React
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Container, Typography } from '@mui/material';

import {
    formStyles,
    GetFormikFields,
} from '../../../components/formik'

import { AdminLayout } from '../../components/adminLayout'
import { formFields, initialValues, validationSchema } from './form'

// Variable
import { usersActions as actions } from '../../../../_actions'

export function ProfileAdminPage(): React.ReactElement {
    const { user } = useSelector((store: any) => store.authentication)
    const { loading, data } = useSelector((store: any) => store.users)

    const classes = formStyles()
    const dispatch = useDispatch()

    // Edit listener
    useEffect(() => {
        if (user.id) {
            dispatch(actions.getOne(+user.id))
        }
    }, [user])

    // Edit form listener
    useEffect(() => {
        if (data) {
            const {
                name,
                email,
                phone,
                legalId,
            } = data;

            const options: any = {
                name,
                email,
                phone,
                legalId,
                password: '',
            }

            formik.setValues(options)
        }
    }, [data])

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: ({
            password,
            legalId,
            ...rest
        }) => {
            if (user.id) {
                const options: any = {
                    legalId: legalId.toString(),
                    ...rest
                }

                if (password.length) {
                    options.password = password
                }

                dispatch(actions.updateOne(+user.id, options, {
                    toast: "Datos actualizados!",
                    redirect: "/admin"
                }))
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
        <AdminLayout>
            <Container>
                <Typography
                    component="h1"
                    variant="h5"
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Actualizar perfil
                </Typography>
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
                        {data ? 'Actualizar' : 'Crear'}
                    </Button>
                </form>
            </Container>
        </AdminLayout>
    )
}
