// React
import React, { useEffect } from 'react'
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'

import theme from '../../../../theme/main'
import { AdminLayout } from '../../components/adminLayout'
import { DataTablaParams, DataTable } from '../../../components/table'

import { AppHistory } from '../../../../helpers'
import { specialitiesActions as actions } from '../../../../_actions'

export function ListSpecialitiesPage(): React.ReactElement {
  const listName = 'Especialidades médicas';
  const { items = [] } = useSelector((state: any) => state.specialities)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      actions.getAll({
        limit: 25000,
        offset: 0,
      })
    )
  }, [])

  const toggleAction = (id: number) => {
    dispatch(actions.toggleActive(id, {
      toast: "Especialidad médica actualizada!"
    }))
  }

  const editAction = (id: number) => {
    AppHistory.push('/admin/especialidades/editar/' + id)
  }

  const params: DataTablaParams = {
    columns: [
      {
        field: 'id',
        headerName: 'ID',
        description: 'Id único en la BD',
        flex: 1,
        minWidth: 100
      },
      {
        field: 'name',
        headerName: 'Nombre',
        description: 'Nombre del consultorio médico',
        flex: 1,
        minWidth: 200
      },
      {
        field: 'officeName',
        headerName: 'Consultorio médico',
        description: 'Consultorio médico de la especialidad',
        flex: 1,
        minWidth: 200
      },
      {
        field: 'isActive',
        headerName: 'Activo',
        description: '¿Está habilitado?',
        type: 'boolean',
        flex: 1,
        minWidth: 200
      },
    ],
    rows: items?.map((el: any) => {
      el.officeName = el.office.name
      return el
    }) ?? [],
    toggleAction,
    editAction,
  }

  return (
    <AdminLayout>
      <Box width="100%" maxWidth="2000px" justifyContent="center">
        <Typography
          component="h1"
          variant="h5"
          style={{
            textAlign: 'center',
          }}
        >
          Listado de {listName}
        </Typography>

        <Box
          display="flex"
          mt={theme.spacing(1)}
          style={{
            height: '700px',
            width: '100%',
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <DataTable {...params} />
          </div>
        </Box>
      </Box>
    </AdminLayout>
  )
}
