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

      // const queryBuilder = createQueryBuilder(model).where(formatFilter)

      // const count = await queryBuilder.getCount()
      // const results = await queryBuilder.skip(offset).take(limit).getMany()

      const { getRepository } = require('typeorm')
      const fieldsWithRelations = getReleationsByModelName(model)
      const relations = []
      const options = {}
    
      for (const key in fieldsWithRelations) {
        relations.push(key)
        options[key] = await createQueryBuilder(key).getMany()
      }

      const [results, count] = await getRepository(model).findAndCount({
        relations,
        where: formatFilter,
        skip: offset,
        take: limit
      })

      response.json(onSuccessResponse(model, { request, results, count }))
    },

    async options (request, response) {
      return response.json(onSuccessResponse(model, { request }))
    },

    async show (request, response) {
      const {
        params: { uuid }
      } = request

      const { getRepository } = require('typeorm')
      const fieldsWithRelations = getReleationsByModelName(model)
      const relations = []
      const options = {}

      for (const key in fieldsWithRelations) {
        relations.push(key)
        options[key] = await createQueryBuilder(key).getMany()
      }

      const result = await getRepository(model).findOne({ where: { uuid }, relations })

      result
        ? response.json(onSuccessResponse(model, { request, result, options }))
        : notFound(response)
    },

    async create (request, response) {
      const { body } = request

      const { validationResult } = require('express-validator')
      const errors = validationResult(request)

      if (!errors.isEmpty()) {
        return response.status(400).json(onErrorResponse(errors.array()))
      }

      await createQueryBuilder()
        .insert()
        .into(model)
        .values(body)
        .execute()

      response.json(status(200, 'Created'))
    },

    async update (request, response) {
      const {
        body,
        params: { uuid }
      } = request

      const { formatBody } = require('../utils/relations')

      const { getRepository } = require('typeorm')
      const fieldsWithRelations = getReleationsByModelName(model)
      const relations = []
      const options = {}

      for (const key in fieldsWithRelations) {
        relations.push(key)
        options[key] = await createQueryBuilder(key).getMany()
      }

      let item = await getRepository(model).findOne({ where: { uuid }, relations, options })

      if (!item) {
        return notFound(response)
      }

      const { validationResult } = require('express-validator')
      const errors = validationResult(request)

      if (!errors.isEmpty()) {
        return response.status(400).json(onErrorResponse(errors.array()))
      }

      item = { ...formatBody(model, body) }

      await getRepository(model).save(item)

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
      return response.json(onSuccessResponse(model, { request }, false))
    }
  }
}
