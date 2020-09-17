const blankTypes = [null, undefined, '']

function notFound (response) {
  return response.status(404).json(status(404, 'Not found'))
}

function status (code, text) {
  return { status: { code, text } }
}

module.exports = function (model, fields, toolbox) {
  const { createQueryBuilder, getRepository } = require('typeorm')
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

      const filterService = require('./filterService').filterService(model)
      const formattedFilters = filterService.formatFilter(search, filters)

      if (search || Object.keys(filters).length) {
        try {
          const query = createQueryBuilder(model).andWhere(formattedFilters)
          const count = await query.getCount()

          const results = (await query
            .skip(offset).take(limit).getMany()
          )

          response.json(
            formatResponse(model, { request, results })
          )
        } catch (error) {
          response.json(
            formatResponse(model, { request, results: [] })
          )
        }
      } else {
        const query = createQueryBuilder(model)
        const counter = await query.getCount()

        const results = (await query
          .skip(offset).take(limit).getMany()
        )

        response.json(
          formatResponse(model, { request, results })
        )
      }
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
      // await request
      return response.json({ fields: formatResponse(model, { request }).fields })
    }
  }
}
