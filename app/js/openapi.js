const openapi = require('@wesleytodd/openapi')

const oapi = openapi({
  openapi: '3.0.0',
  info: {
    title: 'Chat',
    description: 'Chat stuff',
    version: '1.0.0',
  },
  // servers: [
  //   {
  //     url: 'https://healthy-chipped-glade.glitch.me',
  //   },
  // ],
})

oapi.schema('ObjectId', {
  type: 'string',
  format: 'uuid',
  example: '507f1f77bcf86cd799439011',
})

oapi.schema('UnixTimestamp', {
  type: 'integer',
  example: 1615299310,
})

oapi.schema('MessageContent', {
  type: 'string',
  example: 'My amazing message!',
})

module.exports = oapi
