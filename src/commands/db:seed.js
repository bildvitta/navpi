module.exports = {
  name: 'db:seed',
  alias: ['db:s'],

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

    function getValue (model) {
      const value = {}

      for (const field of models[model].fields) {
        const pattern = seeder(field.__value || seederTypes[field.type])
        value[field.name] = seeder(pattern)
      }

      return value
    }

    function getValues (model) {
      const entries = options.entries || options.e || 25
      return Array(entries).fill().map(entry => getValue(model))
    }

    function seed (model, values) {
      return connection
        .createQueryBuilder().insert()
        .into(model).values(values)
        .execute()
    }

    for (const model in models) {
      const modelName = startCase(model)
      const spinner = print.spin(`Seeding ${modelName}...`)

      const values = getValues(model)

      try {
        await seed(model, values)
        spinner.succeed(`${modelName} was seeded.`)
      } catch (error) {
        spinner.fail(`Error seeding ${modelName}.`)
      }
    }

    print.success('Done!')
  }
}
