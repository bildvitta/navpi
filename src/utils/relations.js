const relations = {}
const relationsTypes = {
  oneToMany: {},
  manyToMany: {},
  manyToOne: {}
}

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
  const relation = formatRelationByModelName(modelName)

  for (const key in body) {
    if (relation[key]) {
      body[key] = relationsType[relation[key].type](body[key])
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
    oneToOne: { type: 'one-to-one' },
    manyToOne: { type: 'many-to-one', joinColumn: true },
    oneToMany: { type: 'one-to-many', inverseSide: 'companies_domains', joinColumn: true }
  }

  for (const key in getReleationsByModelName(name)) {
    const relation = getReleationsByModelName(name)

    formatted[key] = { ...relations[getReleationsByModelName(name)[key].__relation_type], target: key }
  }

  return formatted
}

function formatRelationByModelName (name) {
  const relation = {}

  const types = {
    manyToMany: { type: 'many-to-many', joinTable: true, cascade: true },
    manyToOne: { type: 'many-to-one', joinColumn: true },
    oneToMany: { type: 'one-to-many' }
  }

  for (const key in relationsTypes) {
    if (Object.keys(relationsTypes[key]).length && relationsTypes[key][name]) {
      relationsTypes[key][name].forEach(item => {
        relation[item] = {
          ...types[key], target: item, inverseSide: key === 'oneToMany' ? name : undefined
        }
      })
    }
  }

  return relation
}

function getRelations (name) {
  const { models } = require('./models')

  for (const key in models) {
    const model = models[key]

    relations[key] = getReleationsByModelName(key)
  }

  for (const key in relations) {
    if (Object.keys(relations[key]).length) {
      for (const relationKey in relations[key]) {
        const model = relations[key][relationKey].multiple ? 'manyToMany' : 'manyToOne'

        relationsTypes[model][key] = [
          relationKey,
          ...(relationsTypes[model][key] || [])
        ]
        // relationsTypes[relations[key][relationKey].__relation_type][key] = [
        //   relationKey,
        //   ...(relationsTypes[relations[key][relationKey].__relation_type][key] || [])
        // ]

        relationsTypes['oneToMany'][relationKey] = [
          key,
          ...(relationsTypes['oneToMany'][relationKey] || [])
        ]

        // if (relations[key][relationKey].__relation_type === 'oneToMany') {
        //   relationsTypes['manyToOne'][relationKey] = [
        //     key,
        //     ...(relationsTypes['manyToOne'][relationKey] || [])
        //   ]

        //   continue
        // }

        // if (relations[key][relationKey].__relation_type === 'manyToOne') {
        //   relationsTypes['oneToMany'][relationKey] = [
        //     key,
        //     ...(relationsTypes['oneToMany'][relationKey] || [])
        //   ]
        // }
      }
    }
  }
}

module.exports = {
  relations,
  formatRelationByModelName,
  getRelations,
  formatBody,
  getReleationsByModelName,
  formatRelations,
  hasRelation,
  getFieldsWithNoRelationByName,
  getRelationsListAndOptions
}
