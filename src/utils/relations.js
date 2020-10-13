const { getModel } = require('./models')

const relationsType = {
  'many-to-many': (list) => updateManyToMany(list),
  'one-to-one': (uuid) => updateOneToOne(uuid),
  'many-to-one': (uuid) => updateOneToOne(uuid),
  'one-to-many': (uuid) => updateOneToOne(uuid)
}

function updateManyToMany (list) {
  return list.map(item => { return { uuid: item } })
}

function updateOneToOne (uuid) {
  return { uuid } || uuid
}

function formatBody (modelName, body) {
  const relations = formatRelations(modelName)
  console.log(relations)

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
    const relation = getReleationsByModelName(name)[key]

    const relationType = (relation.type === 'select' && relation.multiple) || relation.type === 'checkbox'
      ? 'manyToMany'
      : 'oneToOne'

    // formatted[key] = { ...relations[relationType], target: key }
    formatted[key] = { ...relations[relation.__relationType], target: key }
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
