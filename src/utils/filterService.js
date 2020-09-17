
function filterService (modelName) {
  const model = require('./models').models[modelName]

  return {
    formatFilter (search, filters) {
      const formattedFilters = []

      const { Like } = require('typeorm')

      model.fields.forEach((item, index) => {
        if (item.__search) {
          return formattedFilters.push({ [item.name]: Like(`%${search || filters[item.name]}%`) })
        }

        if (filters.hasOwnProperty(item.name)) {
          return formattedFilters.push({
            [item.name]: item.type === 'text' ? Like(`%${filters[item.name]}%`) : filters[item.name]
          })
        }
      })

      return formattedFilters
    }
  }
}

module.exports = {
  filterService
}
