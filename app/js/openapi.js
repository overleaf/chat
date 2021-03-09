const openapi = require('@wesleytodd/openapi')

module.exports = openapi({
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
