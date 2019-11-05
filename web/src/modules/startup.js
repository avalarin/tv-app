import queryString from 'query-string'
import { DEFAULT_APP, APPS } from '../apps'
import { AppError, ERROR_INVALID_STARTUP_PARAMETERS } from 'tv-app-common'

export function selectStartupInfo(state) {
  const query = queryString.parse(state.router.location.search)

  if (query.reconnect) {
    if (query.role) throw new AppError(ERROR_INVALID_STARTUP_PARAMETERS, { param: 'role' })
    if (query.display) throw new AppError(ERROR_INVALID_STARTUP_PARAMETERS, { param: 'display' })
    if (query.app) throw new AppError(ERROR_INVALID_STARTUP_PARAMETERS, { param: 'app' })

    return {
      reconnect: query.reconnect
    }
  }

  if (query.role && query.role !== 'device' && query.role !== 'display') {
    throw new AppError(ERROR_INVALID_STARTUP_PARAMETERS, { param: 'role' })
  }

  if (query.role === 'device' && !query.display) {
    throw new AppError(ERROR_INVALID_STARTUP_PARAMETERS, { param: 'display' })
  }

  if ((query.role || 'display') === 'display' && query.app && APPS.indexOf(query.app) === -1) {
    throw new AppError(ERROR_INVALID_STARTUP_PARAMETERS, { param: 'app' })
  }

  return {
    role: query.role || 'display',
    display: query.display,
    reconnect: query.reconnect,
    app: query.app || DEFAULT_APP
  }
}
