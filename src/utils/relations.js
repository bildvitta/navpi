const { getModel } = require('./models')

const relationsType = {
  'many-to-many': (list) => updateManyToMany(list),
  'one-to-one': (uuid) => updateOneToOne(uuid)
}

function updateManyToMany (list) {
  return list.map(item => { return { uuid: item } })
}

function updateOneToOne (uuid) {
  return { uuid } || uuid
}

function formatBody (modelName, body) {
  const { formatRelations } = require('./models')
  const relations = formatRelations(modelName)

  for (const key in body) {
    if (relations[key]) {
      body[key] = relationsType[relations[key].type](body[key])
    }
  }

  return body
}

function

// ------------------------------------------------
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
    manyToMany: { type: 'many-to-many', joinTable: true, cascade: true },
    oneToOne: { type: 'one-to-one', joinColumn: true }
  }

  for (const key in getReleationsByModelName(name)) {
    const relation = getReleationsByModelName(name)[key]

    const relationType = (relation.type === 'select' && relation.multiple) || relation.type === 'checkbox'
      ? 'manyToMany'
      : 'oneToOne'

    formatted[key] = { ...relations[relationType], target: key }
  }

  return formatted
}


module.exports = {
  formatBody,
  getReleationsByModelName,
  formatRelations,
  hasRelation,
  getFieldsWithNoRelationByName,
}
