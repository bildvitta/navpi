async function createConnection (toolbox) {
  const {
    parameters: { options },
    print
  } = toolbox

  const {
    loadModels,
    getEntityByModelName,
    models
  } = require('./models')

  const modelsSpinner = print.spin('Loading models...')

  try {
    loadModels(toolbox)
    modelsSpinner.succeed('Models loaded.')
  } catch (error) {
    modelsSpinner.fail('Error loading models.')
  }

  const typeorm = require('typeorm')
  const EntitySchema = typeorm.EntitySchema

  const entities = Object.keys(models).map(
    model => new EntitySchema(getEntityByModelName(model))
  )

  const { getSettings } = require('../utils/settings')
  const settings = getSettings(toolbox)

  const syncSpinner = print.spin('Synchronizing...')

  try {
    const connection = await typeorm.createConnection({
      ...settings.database,

      dropSchema: options.reset || options.r,
      synchronize: true,

      entities
    })

    syncSpinner.succeed('Synchronized.')
    return Promise.resolve({ connection, models })
  } catch (error) {
    syncSpinner.fail('Synchronization error.')
    return Promise.reject(error)
  }
}

module.exports = createConnection