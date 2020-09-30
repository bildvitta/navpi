function notFound (response) {
  return response.status(404).json(status(404, 'Not found'))
}

function status (code, text) {
  return { status: { code, text } }
}

module.exports = function (model, fields) {
  const { createQueryBuilder } = require('typeorm')
  const { onSuccessResponse, onErrorResponse } = require('./formatResponse')

  return {
    async index (request, response) {
      const {
        limit = 12,
        offset = 0,
        ordering,
        search,
        ...filters
       } = request.query

      const formatFilter = require('./formatFilter')

      const queryBuilder = createQueryBuilder(model).where(formatFilter(model, search, filters))

      const count = await queryBuilder.getCount()
      const results = await queryBuilder.skip(offset).take(limit).getMany()

      response.json(onSuccessResponse(model, { request, results, count }))
    },

    async show (request, response) {
      const {
        params: { uuid }
      } = request

      const result = await createQueryBuilder(model)
        .where(`${model}.uuid = :uuid`, { uuid })
        .getOne()

      result
        ? response.json(onSuccessResponse(model, { request, result }))
        : notFound(response)
    },

    async create (request, response) {
      const { body } = request

      const { validationResult } = require('express-validator')
      const errors = validationResult(request)

      if (!errors.isEmpty()) {
        return response.json(onErrorResponse(errors.array()))
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

      const { validationResult } = require('express-validator')
      const errors = validationResult(request)

      if (!errors.isEmpty()) {
        return response.json(onErrorResponse(errors.array()))
      }

      await createQueryBuilder(model)
        .update()
        .set(body)
        .where(`${model}.uuid = :uuid`, { uuid })
        .execute()

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
