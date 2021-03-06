import * as Yup from 'yup'
import { validationMessages } from '../../../../constants/formik'

import { add } from 'date-fns'

const today = new Date()

export const validationSchema = Yup.object({
  date: Yup.string().required(validationMessages.required),
  dateEnd: Yup.string().required(validationMessages.required),
  startHour: Yup.string().required(validationMessages.required),
  endHour: Yup.string().required(validationMessages.required),
  appointmentInterval: Yup.number().min(15, validationMessages.min.replace('$', '15 minutos')).max(60, validationMessages.max.replace('$', '60 minutos')).required(validationMessages.required),
  officeId: Yup.string().required(validationMessages.required),
  specialityId: Yup.string().required(validationMessages.required),
  specialistId: Yup.string().required(validationMessages.required)
})

export const initialValues = ({
  date: today,
  dateEnd: today,
  startHour: today,
  endHour: today,
  appointmentInterval: 15,
  officeId: '',
  specialityId: '',
  specialistId: '',
  isActive: 0
})

export const formFields = ({
  date: {
    type: 'date',
    label: 'Fecha inicio',
    disablePast: false,
    maxDate: add(today, { years: 1 }),
    required: true
  },
  dateEnd: {
    type: 'date',
    label: 'Fecha final',
    disablePast: false,
    maxDate: add(today, { years: 1 }),
    required: true
  },
  startHour: {
    type: 'hour',
    label: 'Hora inicio',
    required: true
  },
  endHour: {
    type: 'hour',
    label: 'Hora final',
    required: true
  },
  appointmentInterval: {
    type: 'number',
    label: 'Duración cita médica (Minuntos)',
    required: true
  },
  isActive: {
    type: 'checkbox',
    label: '¿Está habilitado?',
    required: true
  }
})