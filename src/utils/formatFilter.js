function formatFilter (modelName, search, filters) {
  if (!search && !Object.keys(filters).length) {
    return []
  }

  const model = require('./models').getModel(modelName)
  const searchLikeTypes = ['text', 'textarea']

  const formattedFilters = []

  const { Like } = require('typeorm')

  model.fields.forEach((item, index) => {
    if (item.__search) {
      return formattedFilters.push({ [item.name]: Like(`%${search || filters[item.name]}%`) })
    }

    if (Object.prototype.hasOwnProperty.call(filters, item.name)) {
      return formattedFilters.push({
        [item.name]: searchLikeTypes.includes(item.type) ? Like(`%${filters[item.name]}%`) : filters[item.name]
      })
    }
  })

  return formattedFilters
}

module.exports = formatFilter
