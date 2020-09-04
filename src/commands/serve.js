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
    const { addRoute, routes } = require('../utils/routes')
    
    // Actions
    for (const model in models) {
      const actions = require('../utils/actions')(model)

      addRoute({
        path: `/${model}`,
        method: 'get',
        action: actions.fetchList
      })

      addRoute({
        path: `/${model}/:uuid`,
        method: 'get',
        action: actions.fetchSingle
      })
    }

    // Routes
    const bodyParser = require('body-parser')
    const server = require('express')()
    server.use(bodyParser.json())

    for (const route of routes) {
      server[route.method](route.path, (request, response, next) =>
        route.action(request, response).then(next).catch(next)
      )
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


    // const routesSpinner = print.spin('Registering routes...')
    // const { routes } = require('../utils/routes.js')

    // const server = express()
    // server.use(bodyParser.json())

    // for (const route of routes) {
    //   server[route.method](route.path, (request, response, next) =>
    //     route.action(request, response).then(next).catch(next)
    //   )
    // }

    // routesSpinner.succeed('Successfully registered routes.')

    // const serverSpinner = print.spin('Launching application...')

    // const settings = getSettings(toolbox)
    // const port = options.port || options.p || settings.server.port

    // // actions
    // const CreateActions = require('../utils/actions/createActions')
    // const { loadModels, models, getEntityByModelName } = require('../utils/models')

    // const createConnection = require('../utils/connection')
    
    // loadModels(toolbox)
    // const actions = new CreateActions(server, models)

    // createConnection(toolbox).then(() => {
    //   Object.keys(models).forEach(model => {
    //     actions.fetchById(getEntityByModelName(model))
    //     actions.fetchList(getEntityByModelName(model))
    //     actions.create(getEntityByModelName(model))
    //     actions.update(getEntityByModelName(model))
    //     actions.destroy(getEntityByModelName(model))
    //   })
    // })

    // try {
    //   server.listen(port, () => {
    //     serverSpinner.succeed('Application has been launched.')
    //     const url = `http://localhost:${port}`

    //     breakLine()
    //     print.info(`🚀 ${url}`)
    //     breakLine()
    //   })
    // } catch (error) {
    //   serverSpinner.fail('Error launching application.')
    // }
  }
}
