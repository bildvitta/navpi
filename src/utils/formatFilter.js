function formatFilter (modelName, search, filters) {
  if (!search && !Object.keys(filters).length) {
    return undefined
  }

  const model = require('./models').getModel(modelName)
  const fields = model.fields

  const searchLikeTypes = ['text', 'textarea', 'email']

  const formattedFilters = []

  const { Like } = require('typeorm')

  for (const key in fields) {
    if (fields[key].__search) {
      formattedFilters.push({ [key]: Like(`%${search || filters[key]}%`) })
      continue
    }

    if (Object.prototype.hasOwnProperty.call(filters, key)) {
      formattedFilters.push({
        [key]: searchLikeTypes.includes(fields[key].type) ? Like(`%${filters[key]}%`) : filters[key]
      })
    }
  }

  return formattedFilters
}

module.exports = formatFilter
