const relations = require('./relations')

function notFound (response) {
  return response.status(404).json(status(404, 'Not found'))
}

function status (code, text) {
  return { status: { code, text } }
}

module.exports = function (model, fields) {
  const { createQueryBuilder } = require('typeorm')
  const { onSuccessResponse, onErrorResponse } = require('./formatResponse')
  const { getReleationsByModelName, formatRelations } = require('./relations')

  return {
    async index (request, response) {
      const {
        limit = 12,
        offset = 0,
        ordering,
        search,
        ...filters
       } = request.query

      const formatFilter = require('./formatFilter')(model, search, filters)

      // if request send some query that does not exist it will return empty results with out make a query in databasei
      // if we send a wrong query to "where" it will returns all results
      if (Array.isArray(formatFilter) && !formatFilter.length) {
        return response.json(onSuccessResponse(model, { request, results: [], count: 0 }))
      }

      const { getRepository } = require('typeorm')
      const { getRelationsListAndOptions } = require('../utils/relations')
      const { options, relations } = await getRelationsListAndOptions(model)

      const [results, count] = await getRepository(model).findAndCount({
        relations,
        where: formatFilter,
        skip: offset,
        take: limit
      })

      response.json(onSuccessResponse(model, { request, results, count, options }))
    },

    async options (request, response) {
      const { getRelationsListAndOptions } = require('../utils/relations')
      const { options, relations } = await getRelationsListAndOptions(model)

      return response.json(onSuccessResponse(model, { request, options }))
    },

    async show (request, response) {
      const {
        params: { uuid }
      } = request

      const { getRepository } = require('typeorm')
      const fieldsWithRelations = getReleationsByModelName(model)
      const { getRelationsListAndOptions } = require('../utils/relations')
      const { options, relations } = await getRelationsListAndOptions(model)

      const result = await getRepository(model).findOne({ where: { uuid }, relations })

      result
        ? response.json(onSuccessResponse(model, { request, result, options }))
        : notFound(response)
    },

    async create (request, response) {
      const { body } = request
      const { getRepository } = require('typeorm')
      const { validationResult } = require('express-validator')
      const { formatBody, getRelationsListAndOptions } = require('../utils/relations')
      const errors = validationResult(request)

      if (!errors.isEmpty()) {
        return response.status(400).json(onErrorResponse(errors.array()))
      }

      const itemRepository = getRepository(model)
      const item = itemRepository.create({ ...formatBody(model, body) })
      await itemRepository.save(item)

      response.json(status(200, 'Created'))
    },

    async update (request, response) {
      const {
        body,
        params: { uuid }
      } = request

      const { getRepository } = require('typeorm')
      const { formatBody, getRelationsListAndOptions } = require('../utils/relations')
      const { relations, options } = getRelationsListAndOptions(model)
      const itemRepository = getRepository(model)

      let item = await itemRepository.findOne({ where: { uuid }, relations, options })

      if (!item) {
        return notFound(response)
      }

      const { validationResult } = require('express-validator')
      const errors = validationResult(request)

      if (!errors.isEmpty()) {
        return response.status(400).json(onErrorResponse(errors.array()))
      }

      item = { ...formatBody(model, body) }

      await itemRepository.save(item)

      response.json(status(200, 'Updated'))
    },

    async destroy (request, response) {
      const {
        params: { uuid }
      } = request

      const query = await createQueryBuilder(model)
        .delete()
        .where(`${model}.uuid = :uuid`, { uuid })
        .execute()

      query
        ? response.json(status(200, 'Destroyed'))
        : notFound(response)
    },

    async filters (request, response) {
      const { getRelationsListAndOptions } = require('../utils/relations')
      const { options, relations } = await getRelationsListAndOptions(model)

      return response.json(onSuccessResponse(model, { request, options }, false))
    }
  }
}
