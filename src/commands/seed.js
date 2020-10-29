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
        if(fields[key].__randomValues && Array.isArray(fields[key].__randomValues)){
          let randomValue = fields[key].__randomValues[Math.floor(Math.random() * fields[key].__randomValues.length)]
          value[key] = seeder(randomValue)
        }else{
          value[key] = seeder(
            seeder(fields[key].__value || seederTypes[fields[key].type])
          )
        }
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
        throw new Error(error)
        spinner.fail(`Error seeding ${modelName}.`)
      }
    }

    print.success('Done!')
  }
}
