const { getModel } = require('./models')

const relationsType = {
  'many-to-many': list => formatList(list),
  'one-to-one': uuid => formatSingle(uuid),
  'many-to-one': uuid => formatSingle(uuid),
  'one-to-many': uuid => formatSingle(uuid)
}

function formatList (list) {
  return list.map(item => { return { uuid: item } })
}

function formatSingle (uuid) {
  return uuid ? { uuid } : uuid
}

function formatBody (modelName, body) {
  const relations = formatRelations(modelName)

  for (const key in body) {
    if (relations[key]) {
      body[key] = relationsType[relations[key].type](body[key])
    }
  }

  return body
}

async function getRelationsListAndOptions (name, { result, results } = {}) {
  const { createQueryBuilder } = require('typeorm')
  const fieldsWithRelations = getReleationsByModelName(name)
  const relations = []
  const options = {}

  for (const key in fieldsWithRelations) {
    relations.push(key)
    options[key] = await createQueryBuilder(key).getMany()
  }

  return {
    relations,
    options
  }
}

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
    oneToOne: { type: 'one-to-one', joinColumn: true },
    manyToOne: { type: 'many-to-one', joinColumn: true },
    oneToMany: { type: 'one-to-many' }
  }

  for (const key in getReleationsByModelName(name)) {
    formatted[key] = { ...relations[getReleationsByModelName(name)[key].__relation_type], target: key }
  }

  return formatted
}

module.exports = {
  formatBody,
  getReleationsByModelName,
  formatRelations,
  hasRelation,
  getFieldsWithNoRelationByName,
  getRelationsListAndOptions
}
