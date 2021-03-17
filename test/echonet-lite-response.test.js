const EchonetLiteResponse = require('../src/echonet-lite/response')

test('parse', () => {
  const buf = Buffer.from('1081000302880105FF017201E704FFFFF856', 'hex')
  const res = new EchonetLiteResponse(buf)

  expect(res.ehd).toEqual(Buffer.from([0x10, 0x81]))
  expect(res.tid).toEqual(Buffer.from([0x00, 0x03]))
  expect(res.seoj).toEqual(Buffer.from([0x02, 0x88, 0x01]))
  expect(res.deoj).toEqual(Buffer.from([0x05, 0xFF, 0x01]))
  expect(res.esv).toEqual(Buffer.from([0x72]))
  expect(res.opc).toEqual(Buffer.from([0x01]))
})

test('get_operation_property_count', () => {
  const min_buf = Buffer.from('1081000302880105FF017201E704FFFFF856', 'hex')
  const min_res = new EchonetLiteResponse(min_buf)
  expect(min_res.get_operation_property_count()).toBe(1)

  const max_buf = Buffer.from('1081000302880105FF0172FFE704FFFFF856', 'hex')
  const max_res = new EchonetLiteResponse(max_buf)
  expect(max_res.get_operation_property_count()).toBe(255)
})

test('convert_to_hex_array', () => {
  const buf = Buffer.from('1081000302880105FF017201E704FFFFF856', 'hex')
  const res = new EchonetLiteResponse(buf)
  expect(res.convert_to_hex_array(Buffer.from('1081', 'hex'))).toEqual([0x10, 0x81])
})

test('get_properties', () => {
  // OPC: 1, [PDC: 4]
  const buf = Buffer.from('1081000302880105FF017201E704FFFFF856', 'hex')
  const res = new EchonetLiteResponse(buf)
  expect(res.get_properties()).toEqual([{
    epc: Buffer.from('E7', 'hex'),
    pdc: 4,
    edt: Buffer.from('FFFFF856', 'hex')
  }])

  // OPC: 2, ['PDC: 4', 'PDC: 3']
  const buf_double = Buffer.from('1081000302880105FF017202E704FFFFF856E703FFF856', 'hex')
  const res_double = new EchonetLiteResponse(buf_double)
  expect(res_double.get_properties()).toEqual([{
    epc: Buffer.from('E7', 'hex'),
    pdc: 4,
    edt: Buffer.from('FFFFF856', 'hex')
  }, {
    epc: Buffer.from('E7', 'hex'),
    pdc: 3,
    edt: Buffer.from('FFF856', 'hex')
  }])
})

