const TestEnvironment = require('./env')
const utils = require('./utils')

describe("Reconnection", () => {
  const env = TestEnvironment.create()
  afterAll(done => env.stop().then(done))

  describe('GIVEN connected client', () => {
    let connection, client
    beforeEach(async () => {
      connection = await env.connect()
      client = await utils.createDisplay(connection)
    })

    describe('WHEN original connection closed and client connects again with reconnectId', () => {
      let connection2
      beforeEach(async () => {
        connection.close()

        connection2 = await env.connect()
        connection2.send('register', { reconnectId: client.reconnectId })
      })

      test('THEN response should be received with ok', async () => {
        const response = await connection2.receive()
        expect(response.ok).toBe(true)
        expect(response.type).toBe('register')
        expect(response.role).toBe('display')
        expect(response.id).toBe(client.id)
        expect(response.reconnectId).not.toBeNull()
      })
    })

    describe('WHEN original connection lives and client connects again with reconnectId', () => {
      let connection2
      beforeEach(async () => {
        connection2 = await env.connect()
        connection2.send('register', { reconnectId: client.reconnectId })
      })

      test('THEN response should be received with error client_still_connected', async () => {
        const response = await connection2.receive()
        expect(response.ok).toBe(false)
        expect(response.error).toBe('client_still_connected')
      })
    })
  })

  describe('GIVEN display and connected device', () => {
    let displayConn, display, deviceConn, device

    beforeEach(async () => {
      displayConn = await env.connect('DISPLAY')
      display = await utils.createDisplay(displayConn)

      deviceConn = await env.connect('DEVICE')
      device = await utils.createDevice(deviceConn, display.id)
    })

    describe('WHEN device disconnected and device reconnects', () => {
      beforeEach(async () => {
        deviceConn.close()

        const deviceConn2 = await env.connect('DEVICE-2')
        deviceConn2.send('register', { reconnectId: device.reconnectId })
      })

      test('THEN display should receive device_connected', async () => {
        const response = await displayConn.receive()
        expect(response.ok).toBe(true)
        expect(response.type).toBe('device_connected')
        expect(response.from).toBe(device.id)
      })
    })

    describe('WHEN display disconnected and display reconnects', () => {
      let displayCon2

      beforeEach(async () => {
        displayConn.close()

        displayCon2 = await env.connect('DISPLAY-2')
        displayCon2.send('register', { reconnectId: display.reconnectId })
      })

      test('THEN device should receive display_connected', async () => {
        const response = await deviceConn.receive()
        expect(response.ok).toBe(true)
        expect(response.type).toBe('display_connected')
        expect(response.from).toBe(display.id)
      })

      test('THEN display should receive list of all connected devices', async () => {
        const response = await displayCon2.receive()
        expect(response.ok).toBe(true)
        expect(response.type).toBe('register')
        expect(response.devices).toContainEqual({ id: device.id })
      })
    })
  })
})
