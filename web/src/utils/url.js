import queryString from 'query-string'

export function buildUrl(url, qsParams) {
  const parsed = queryString.parseUrl(url)

  return parsed.url + '?' + queryString.stringify({ ...parsed.query, ...qsParams })
}