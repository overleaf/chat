const openapi = require('@wesleytodd/openapi')
const MessageHttpController = require('./Features/Messages/MessageHttpController')

const oapi = openapi({
  openapi: '3.0.0',
  info: {
    title: 'Chat',
    description: 'Chat stuff',
    version: '1.0.0'
  },
  tags: [
    {
      name: 'messages',
      description: 'Retrieving and sending project global messages'
    },
    {
      name: 'threads',
      description: 'Handling threads in project chat'
    }
  ]
  // servers: [
  //   {
  //     url: 'https://healthy-chipped-glade.glitch.me',
  //   },
  // ],
})

// Schema components

oapi.schema('ObjectId', {
  type: 'string',
  pattern: '^[0-9a-fA-F]{24}$',
  example: '507f1f77bcf86cd799439011'
})

oapi.schema('ObjectIdOptional', {
  allOf: [{ $ref: '#/components/schemas/ObjectId' }, { nullable: true }]
})

oapi.schema('UnixTimestamp', {
  type: 'integer',
  example: 1615299310
})

oapi.schema('UnixTimestampOptional', {
  allOf: [{ $ref: '#/components/schemas/UnixTimestamp' }, { nullable: true }]
})

oapi.schema('MessageContent', {
  type: 'string',
  example: 'My amazing message!',
  maxLength: MessageHttpController.MAX_MESSAGE_LENGTH
})

oapi.schema('MessageBase', {
  type: 'object',
  properties: {
    id: { $ref: '#/components/schemas/ObjectId' },
    content: { $ref: '#/components/schemas/MessageContent' },
    user_id: { $ref: '#/components/schemas/ObjectId' },
    timestamp: { $ref: '#/components/schemas/UnixTimestamp' },
    edited_at: { $ref: '#/components/schemas/UnixTimestampOptional' }
  }
})

oapi.schema('ThreadBase', {
  type: 'object',
  properties: {
    messages: {
      type: 'array',
      items: { $ref: '#/components/schemas/MessageBase' }
    },
    resolved: {
      type: 'boolean',
      example: true
    },
    resolved_at: { $ref: '#/components/schemas/UnixTimestampOptional' },
    resolved_by_user_id: { $ref: '#/components/schemas/ObjectIdOptional' }
  }
})

// Responses

oapi.response('GetMessagesResponse', {
  content: {
    'application/json': {
      schema: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/MessageBase'
        }
      }
    }
  }
})

oapi.response('SendMessageResponse', {
  content: {
    'application/json': {
      schema: {
        allOf: [
          { $ref: '#/components/schemas/MessageBase' },
          {
            type: 'object',
            properties: {
              room_id: { $ref: '#/components/schemas/ObjectId' }
            }
          }
        ]
      }
    }
  }
})

oapi.response('GetAllThreadsResponse', {
  content: {
    'application/json': {
      schema: {
        type: 'array',
        items: { $ref: '#/components/schemas/ThreadBase' }
      }
    }
  }
})

module.exports = oapi
