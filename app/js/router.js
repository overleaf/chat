/* eslint-disable
    camelcase,
    max-len,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Router
const MessageHttpController = require('./Features/Messages/MessageHttpController')
const { ObjectId } = require('./mongodb')
const openapi = require('./openapi')

module.exports = Router = {
  route(app) {
    app.param('project_id', function (req, res, next, project_id) {
      if (ObjectId.isValid(project_id)) {
        return next()
      } else {
        return res.status(400).send('Invalid project_id')
      }
    })

    app.param('thread_id', function (req, res, next, thread_id) {
      if (ObjectId.isValid(thread_id)) {
        return next()
      } else {
        return res.status(400).send('Invalid thread_id')
      }
    })

    // These are for backwards compatibility
    app.get(
      '/room/:project_id/messages',
      MessageHttpController.getGlobalMessages
    )
    app.post(
      '/room/:project_id/messages',
      MessageHttpController.sendGlobalMessage
    )

    app.get(
      '/project/:project_id/messages',
      openapi.path({
        parameters: [
          {
            in: 'path',
            name: 'project_id',
            schema: { $ref: '#/components/schemas/ObjectId' },
            required: true,
          },
          {
            in: 'query',
            name: 'before',
            schema: { $ref: '#/components/schemas/UnixTimestamp' },
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              default: 50,
            },
          },
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { $ref: '#/components/schemas/ObjectId' },
                      content: { $ref: '#/components/schemas/MessageContent' },
                      user_id: { $ref: '#/components/schemas/ObjectId' },
                      timestamp: { $ref: '#/components/schemas/UnixTimestamp' },
                    },
                  },
                },
              },
            },
          },
          500: {
            content: {
              'text/html': {
                schema: {
                  description: 'The stack trace of the error',
                  type: 'string',
                },
              },
            },
          },
        },
      }),
      MessageHttpController.getGlobalMessages
    )
    app.post(
      '/project/:project_id/messages',
      MessageHttpController.sendGlobalMessage
    )

    app.post(
      '/project/:project_id/thread/:thread_id/messages',
      MessageHttpController.sendThreadMessage
    )
    app.get('/project/:project_id/threads', MessageHttpController.getAllThreads)

    app.post(
      '/project/:project_id/thread/:thread_id/messages/:message_id/edit',
      MessageHttpController.editMessage
    )
    app.delete(
      '/project/:project_id/thread/:thread_id/messages/:message_id',
      MessageHttpController.deleteMessage
    )

    app.post(
      '/project/:project_id/thread/:thread_id/resolve',
      MessageHttpController.resolveThread
    )
    app.post(
      '/project/:project_id/thread/:thread_id/reopen',
      MessageHttpController.reopenThread
    )
    app.delete(
      '/project/:project_id/thread/:thread_id',
      MessageHttpController.deleteThread
    )

    return app.get('/status', (req, res, next) => res.send('chat is alive'))
  },
}
