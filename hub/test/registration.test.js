const TestEnvironment = require('./env')
const utils = require('./utils')

describe("Registration", () => {
  const env = TestEnvironment.create()
  afterAll(done => env.stop().then(done))

  test('should register display', async () => {
    const conn = await env.connect()

    conn.send('register', { role: 'display', appName: 'test' })

    const response = await conn.receive()
    expect(response.ok).toBe(true)
    expect(response.type).toBe('register')
    expect(response.role).toBe('display')
    expect(response.appName).toBe('test')
    expect(response.id).not.toBeNull()
    expect(response.reconnectId).not.toBeNull()
  })

  test('should register device', async () => {
    const conn1 = await env.connect()
    const display = await utils.createDisplay(conn1)

    const conn2 = await env.connect()
    conn2.send('register', { role: 'device', displayId: display.id })

    const response1 = await conn1.receive({ description: 'device_connected message' })
    expect(response1.ok).toBe(true)
    expect(response1.type).toBe('device_connected')
    expect(response1.id).not.toBeNull()

    const response2 = await conn2.receive({ description: 'register message' })
    expect(response2.ok).toBe(true)
    expect(response2.type).toBe('register')
    expect(response2.role).toBe('device')
    expect(response2.id).not.toBeNull()
    expect(response2.reconnectId).not.toBeNull()
  })

  test('should not register twice, in one connection', async () => {
    const conn = await env.connect()
    await utils.createDisplay(conn)

    const result = await utils.createDisplay(conn)
    expect(result.ok).toBe(false)
    expect(result.error).toBe('already_registered')
  })
})
