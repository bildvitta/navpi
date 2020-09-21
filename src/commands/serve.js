module.exports = {
  name: 'serve',
  alias: ['s', 'srv', 'server'],

  run: async toolbox => {
    const {
      parameters: { options },
      print
    } = toolbox

    function breakLine () {
      print.info('')
    }

    const routesSpinner = print.spin('Registering routes...')

    // Models
    const { loadModels, models } = require('../utils/models')
    loadModels(toolbox)

    await require('../utils/connection')(toolbox)
    const { addRoutes, routes } = require('../utils/routes')

    // Actions
    for (const model in models) {
      const {
        create, destroy, index, update, show, filters
      } = require('../utils/controller')(model, models[model].fields)

      addRoutes([
        { path: `/${model}`, method: 'get', action: index },
        { path: `/${model}/filters`, method: 'get', action: filters },
        { path: `/${model}/:uuid`, method: 'get', action: show },
        { path: `/${model}/:uuid/edit`, method: 'get', action: show },
        { path: `/${model}`, method: 'post', action: create },
        { path: `/${model}/:uuid`, method: 'patch', action: update },
        { path: `/${model}/:uuid`, method: 'put', action: update },
        { path: `/${model}/:uuid`, method: 'delete', action: destroy }
      ])
    }

    // Routes
    const bodyParser = require('body-parser')
    const server = require('express')()
    const cors = require('cors')
    const boolParser = require('express-query-boolean')

    server.use(cors(), bodyParser.json(), boolParser())

    for (const route of routes) {
      server[route.method](route.path, (request, response, next) => (
        route.action(request, response).then(next).catch(next)
      ))
    }

    routesSpinner.succeed('Successfully registered routes.')

    // Server
    const serverSpinner = print.spin('Launching application...')

    const { getSettings } = require('../utils/settings')
    const settings = getSettings(toolbox)
    const port = options.port || options.p || settings.server.port

    try {
      server.listen(port, () => {
        serverSpinner.succeed('Application has been launched.')
        const url = `http://localhost:${port}`

        breakLine()
        print.info(`🚀 ${url}`)
        breakLine()
      })
    } catch (error) {
      serverSpinner.fail('Error launching application.')
    }
  }
}
