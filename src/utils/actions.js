module.exports = function (model) {
  const query = require('typeorm').createQueryBuilder(model)
  const formatResponse = require('./formatResponse')

  return {
    async fetchList (request, response) {
      const results = await query.getMany()

      response.json(
        formatResponse(model, { request, results })
      )
    },

    async fetchSingle (request, response) {
      const {
        params: { uuid }
      } = request

      const result = await query.where(
        `${model}.uuid = :uuid`, { uuid }
      ).getOne()

      result
        ? response.json(
          formatResponse(model, { request, result })
        )
        : response.status(404).json({
          message: 'Not found'
        })
    },
  }
}