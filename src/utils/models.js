const models = {}

function addModel (name, model) {
  models[name] = model
}

function getModel (name) {
  return models[name]
}

function getEntityByModelName (name) {
  const { getDatabaseTypeByField } = require('./fieldsDatabaseTypes')
  const { getFieldsWithNoRelationByName, formatRelationByModelName } = require('./relations')

  const fields = getFieldsWithNoRelationByName(name)

  const columns = {
    uuid: { generated: 'uuid', primary: true, type: 'varchar' }
  }

  for (const field in fields) {
    const column = {
      type: getDatabaseTypeByField(fields[field].type)
    }

    if (!fields[field].required) {
      column.nullable = true
    }

    columns[fields[field].name] = column
  }

  return {
    name,
    columns,
    relations: formatRelationByModelName(name)
  }
}

function loadModels ({ filesystem }) {
  const { getRelations } = require('./relations')
  const modelsDirectory = 'models'
  let files = []

  try {
    files = filesystem.find(modelsDirectory, {
      matching: ['*.json', '*.yaml', '*.yml', '*.js']
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
    : extension === 'js' ? require(path) : filesystem.read(path, 'json')

    addModel(name, contents)
  }

  getRelations()

  return models
}

module.exports = {
  models,

  addModel,
  getModel,

  getEntityByModelName,
  loadModels
}
