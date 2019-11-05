const TestEnvironment = require('./env')
const utils = require('./utils')

describe("Disconnection", () => {
  const env = TestEnvironment.create()
  afterAll(done => env.stop().then(done))

  describe('GIVEN display and connected device', () => {
    let displayConn, display, deviceConn, device

    beforeEach(async () => {
      displayConn = await env.connect('DISPLAY')
      display = await utils.createDisplay(displayConn)

      deviceConn = await env.connect('DEVICE')
      device = await utils.createDevice(deviceConn, display.id)
    })
    describe('WHEN device disconnects', () => {
      beforeEach(() => deviceConn.close())

      test('THEN display should receive device_disconnected', async () => {
        const response1 = await displayConn.receive()
        expect(response1.ok).toBe(true)
        expect(response1.type).toBe('device_disconnected')
        expect(response1.from).toBe(device.id)
      })
    })

    describe('WHEN display disconnects', async () => {
      beforeEach(() => displayConn.close())

      test('THEN device should receive display_disconnected', async () => {
        const response1 = await deviceConn.receive()
        expect(response1.ok).toBe(true)
        expect(response1.type).toBe('display_disconnected')
        expect(response1.from).toBe(display.id)
      })
    })
  })
})
