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

    function getValue (model) {
      const value = {}

      for (const field of models[model].fields) {
        value[field.name] = seeder(
          seeder(field.__value || seederTypes[field.type])
        )
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
