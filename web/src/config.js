const apiUrl = process.env.REACT_APP_API_URL || window.location.origin

console.log(apiUrl)

const config = {
  site: {
    baseUrl: window.location.origin
  },
  api: {
    url: apiUrl
  },
  ws: {
    url: buildWsUrl(apiUrl)
  }
}

function buildWsUrl(baseUrl) {
  const url = new URL(baseUrl)
  url.protocol = "ws:"
  url.pathname = "/ws"
  return url.toString()
}

export default () => config