const TestEnvironment = require('./env')
const utils = require('./utils')

describe('Messaging', () => {
  const env = TestEnvironment.create()
  afterAll(done => env.stop().then(done))

  describe('GIVEN display and 2 connected devices', () => {
    let displayConn, display, device1Conn, device1, device2Conn, device2

    beforeEach(async () => {
      displayConn = await env.connect('DISPLAY')
      display = await utils.createDisplay(displayConn)
  
      device1Conn = await env.connect('DEVICE-1')
      device1 = await utils.createDevice(device1Conn, display.id)
  
      device2Conn = await env.connect('DEVICE-2')
      device2 = await utils.createDevice(device2Conn, display.id)
    })

    describe('WHEN device sends message to display', () => {
      beforeEach(async () => {
        device1Conn.send('exchange', { body: { command: 'test' } })
      })

      test('THEN display should receive it', async () => {
        const message = await displayConn.receive({ filter: 'exchange' })
        expect(message.ok).toBe(true)
        expect(message.type).toBe('exchange')
        expect(message.direction).toBe('device2display')
        expect(message.from).toBe(device1.id)
        expect(message.body.command).toBe('test')
      })
    })

    describe('WHEN display sends message to devices', () => {
      beforeEach(async () => {
        displayConn.send('exchange', { body: { command: 'test' } })
      })

      test('THEN each device should receive it', async () => {
        const message1 = await device1Conn.receive({ filter: 'exchange' })
        const message2 = await device2Conn.receive({ filter: 'exchange' })

        expect(message1.ok).toBe(true)
        expect(message1.type).toBe('exchange')
        expect(message1.direction).toBe('display2device')
        expect(message1.from).toBe(display.id)
        expect(message1.body.command).toBe('test')

        expect(message2.ok).toBe(true)
        expect(message2.type).toBe('exchange')
        expect(message2.direction).toBe('display2device')
        expect(message2.from).toBe(display.id)
        expect(message2.body.command).toBe('test')
      })
    })
  })
})
