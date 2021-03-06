const { chunk } = require('lodash')
const bufferSize = 900

module.exports = {
  name: 'seed',

  run: async toolbox => {
    const {
      parameters: { options },
      print,
      strings: { startCase }
    } = toolbox

    const { seederTypes, getSeeder } = require('../utils/seeder')
    const seeder = getSeeder(toolbox)

    const getConnection = require('../utils/connection')
    const { connection, models } = await getConnection(toolbox)
    const { getFieldsWithNoRelationByName } = require('../utils/relations')

    function getValue (model) {
      const fields = getFieldsWithNoRelationByName(model)

      const value = {}

      for (const key in fields) {
        value[key] = seeder(
          fields[key].__random_values && Array.isArray(fields[key].__random_values)
            ? fields[key].__random_values[Math.floor(Math.random() * fields[key].__random_values.length)]
            : fields[key].__value || seederTypes[fields[key].type]
        )
      }

      return value
    }

    function getValues (model) {
      const entries = options.entries || options.e || 25
      return Array(entries).fill().map(entry => getValue(model))
    }

    async function seed (model, values) {
      const fields = getFieldsWithNoRelationByName(model)
      const chunks = chunk(values, bufferSize / Object.keys(fields).length)

      for (const valueChunk of chunks) {
        await connection
          .createQueryBuilder().insert()
          .into(model).values(valueChunk)
          .execute()
      }
    }

    for (const model in models) {
      const modelName = startCase(model)
      const spinner = print.spin(`Seeding ${modelName}...`)

      try {
        await seed(model, getValues(model))
        spinner.succeed(`${modelName} was seeded.`)
      } catch (error) {
        spinner.fail(`Error seeding ${modelName}.`)
      }
    }

    print.success('Done!')
  }
}
