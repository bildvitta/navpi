const models = {}

function addModel (name, model) {
  models[name] = model
}

function getModel (name) {
  return models[name]
}

function getEntityByModelName (name) {
  const { getDatabaseTypeByField } = require('./fieldsDatabaseTypes')
  const { fields } = models[name]

  const columns = {
    uuid: { generated: 'uuid', primary: true, type: 'varchar' }
  }

  for (const field of fields) {
    columns[field.name] = {
      type: getDatabaseTypeByField(field.type)
    }
  }

  return {
    name,
    columns
  }
}

function loadModels ({ filesystem }) {
  const modelsDirectory = 'models'
  let files = []

  try {
    files = filesystem.find(modelsDirectory, {
      matching: ['*.json', '*.yaml', '*.yml']
    })
  } catch (error) {
    throw new Error('Can not find models path.')
  }

  if (!files.length) {
    throw new Error('There is no models.')
  }

  const YAML = require('yaml')

  for (const path of files) {
    const [name, extension] = path.replace(`${modelsDirectory}/`, '').split('.')

    const contents = ['yaml', 'yml'].includes(extension)
      ? YAML.parse(filesystem.read(path))
      : filesystem.read(path, 'json')

    addModel(name, contents)
  }

  return models
}

module.exports = {
  models,

  addModel,
  getModel,

  getEntityByModelName,
  loadModels
}