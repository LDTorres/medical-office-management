import { getToken } from '../helpers/userStorage'
import { Configuration } from '../_api'

export const getConfiguration = (): Configuration => {
  const configuration = new Configuration({
    basePath: process.env.REACT_APP_API_URL ?? "https://consultorio.api.uptbolivar.edu.ve",
    baseOptions: getToken()
      ? {
        headers: {
          Authorization: getToken(),
        },
      }
      : {},
  })

  return configuration
}
