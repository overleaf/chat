module.exports = {
  internal: {
    chat: {
      host: process.env['LISTEN_ADDRESS'] || 'localhost',
      port: 3010
    }
  },

  apis: {
    web: {
      url: `http://${process.env['WEB_HOST'] || 'localhost'}:${process.env[
        'WEB_PORT'
      ] || 3000}`,
      credentials: JSON.parse(process.env['WEB_CREDENTIALS'])
    }
  },

  mongo: {
    url: process.env['MONGO_CONNECTION_STRING'] || `mongodb://${process.env['MONGO_HOST'] || 'localhost'}/sharelatex`
  },

  redis: {
    web: {
      host: process.env['REDIS_HOST'] || 'localhost',
      port: '6379',
      password: process.env['REDIS_PASSWORD'] || ''
    }
  }
}
