const express = require('express')
const bodyParser = require('body-parser')

const { getSettings } = require('../utils/settings.js')

module.exports = {
  name: 'serve',
  alias: ['s', 'srv', 'server'],

  run: async toolbox => {
    const {
      print
    } = toolbox

    function breakLine () {
      print.info('')
    }

    const routesSpinner = print.spin('Registering routes...')
    const { routes } = require('../utils/routes.js')

    const server = express()
    server.use(bodyParser.json())

    for (const route of routes) {
      server[route.method](route.path, (request, response, next) =>
        route.action(request, response).then(next).catch(next)
      )
    }

    routesSpinner.succeed('Successfully registered routes.')

    const serverSpinner = print.spin('Launching application...')
    const settings = getSettings(toolbox)

    try {
      server.listen(settings.server.port, () => {
        serverSpinner.succeed('Application has been launched.')
        const url = `http://localhost:${settings.server.port}`

        breakLine()
        print.info(`🌐 ${url}`)
        breakLine()
      })
    } catch (error) {
      spinner.fail('Error launching application.')
    }
  }
}
