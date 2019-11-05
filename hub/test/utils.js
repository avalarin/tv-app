
async function createDisplay(conn) {
  conn.send('register', { role: 'display' })
  return await conn.receive()
}

async function createDevice(conn, displayId) {
  conn.send('register', { role: 'device', displayId: displayId })
  return await conn.receive()
}

function closeConnections(...conns) {
  conns.forEach(conn => conn.close())
  sleep(500)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = { createDevice, createDisplay, closeConnections }