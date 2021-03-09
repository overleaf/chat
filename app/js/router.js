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
        description: 'Retrieve project messages (global)',
        tags: ['messages'],
        parameters: [
          {
            in: 'path',
            name: 'project_id',
            schema: { $ref: '#/components/schemas/ObjectId' },
            required: true
          },
          {
            in: 'query',
            name: 'before',
            schema: { $ref: '#/components/schemas/UnixTimestamp' }
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              default: 50
            }
          }
        ],
        responses: {
          200: {
            $ref: '#/components/responses/GetMessagesResponse'
          },
          500: {
            content: {
              'text/html': {
                schema: {
                  description: 'The stack trace of the error',
                  type: 'string'
                }
              }
            }
          }
        }
      }),
      MessageHttpController.getGlobalMessages
    )
    app.post(
      '/project/:project_id/messages',
      openapi.path({
        description: 'Send a project message (global)',
        tags: ['messages'],
        parameters: [
          {
            in: 'path',
            name: 'project_id',
            schema: { $ref: '#/components/schemas/ObjectId' },
            required: true
          },
          {
            in: 'body',
            name: 'user_id',
            schema: { $ref: '#/components/schemas/ObjectId' }
          },
          {
            in: 'body',
            name: 'content',
            schema: { $ref: '#/components/schemas/MessageContent' }
          }
        ],
        responses: {
          201: {
            $ref: '#/components/responses/SendMessageResponse'
          },
          400: {
            description: 'Content too long',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                  example: 'Content too long (> 10240 bytes)'
                }
              }
            }
          }
        }
      }),
      MessageHttpController.sendGlobalMessage
    )

    app.post(
      '/project/:project_id/thread/:thread_id/messages',
      MessageHttpController.sendThreadMessage
    )
    app.get(
      '/project/:project_id/threads',
      openapi.path({
        description: 'Get all threads',
        tags: ['threads'],
        parameters: [
          {
            in: 'path',
            name: 'project_id',
            schema: { $ref: '#/components/schemas/ObjectId' },
            required: true
          }
        ],
        responses: {
          200: {
            $ref: '#/components/responses/GetAllThreadsResponse'
          }
        }
      }),
      MessageHttpController.getAllThreads
    )

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
  }
}
