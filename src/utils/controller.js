const blankTypes = [null, undefined, '']

function notFound (response) {
  return response.status(404).json(status(404, 'Not found'))
}

function status (code, text) {
  return { status: { code, text } }
}

module.exports = function (model, fields) {
  const { createQueryBuilder } = require('typeorm')
  const formatResponse = require('./formatResponse')

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

      const queryBuilder = createQueryBuilder(model).where(
        (Object.keys(filters).length || search) ? formatFilter(model, search, filters) : []
      )

      const count = await queryBuilder.getCount()
      const results = await queryBuilder.skip(offset).take(limit).getMany()

      response.json(formatResponse(model, { request, results, count }))
    },

    async show (request, response) {
      const {
        params: { uuid }
      } = request

      const result = await createQueryBuilder(model)
        .where(`${model}.uuid = :uuid`, { uuid })
        .getOne()

      result
        ? response.json(formatResponse(model, { request, result }))
        : notFound(response)
    },

    async create (request, response) {
      const { body } = request
      const errors = {}

      for (const { name, required } of fields) {
        if (required && blankTypes.includes(body[name])) {
          errors[name] = 'Required'
        }
      }

      if (Object.keys(errors).length) {
        response.status(400).json({
          errors,
          ...status(400, 'Bad request')
        })
      } else {
        await createQueryBuilder()
          .insert()
          .into(model)
          .values(body)
          .execute()

        response.json(status(200, 'Created'))
      }
    },

    async update (request, response) {
      const {
        body,
        params: { uuid }
      } = request

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
      return response.json({ fields: formatResponse(model, { request }).fields })
    }
  }
}
