const models = {}

function addModel (name, model) {
  models[name] = model
}

function getModel (name) {
  return models[name]
}

function getReleationsByModelName (name) {
  const relations = {}
  const { fields } = getModel(name)

  for (const key in fields) {
    if (fields[key].__relation) {
      relations[key] = fields[key]
    }
  }

  return relations
}

function getFieldsWithNoRelationByName (name) {
  const fields = getModel(name).fields
  const formattedFields = {}

  for (const key in fields) {
    if (!fields[key].__relation) {
      formattedFields[key] = fields[key]
    }
  }

  return formattedFields
}

function hasRelation (name) {
  return Object.keys(getReleationsByModelName(name)).length
}

function formatRelations (name) {
  const formatted = {}
  const relations = {
    checkbox: { type: 'many-to-many', joinTable: true, cascade: true },
    select: { type: 'one-to-one', joinColumn: true }
  }

  for (const key in getReleationsByModelName(name)) {
    formatted[key] = { ...relations[getReleationsByModelName(name)[key].type], target: key }
  }

  return formatted
}

function getEntityByModelName (name) {
  const { getDatabaseTypeByField } = require('./fieldsDatabaseTypes')
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
    relations: formatRelations(name)
  }
}

function loadModels ({ filesystem }) {
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

  return models
}

module.exports = {
  models,

  addModel,
  getModel,

  getReleationsByModelName,
  formatRelations,
  hasRelation,
  getFieldsWithNoRelationByName,

  getEntityByModelName,
  loadModels
}
