require('express')
require('body-parser')

module.exports = {
  name: 'serve',
  alias: ['s', 'srv'],

  run: async toolbox => {
    // Ler todos os models e registrar as rotas no route.js)
    // Rodar o express.

    const server = express()
    server.use(bodyParser.json())

    for (const route of routes) { // Ler do routes.js
      server[route.method](route.path, (request, response, next) =>
        route.action(request, response).then(next).catch(next)
      )
    }

    server.listen(port) // Ler do arquivo de configuração (vide cosmiconfig no gluegun).
  }
}
