module.exports = {
  name: 'db:seed',
  alias: ['db:s'],

  run: async toolbox => {
    const {
      parameters: { options: { quantity } }
    } = toolbox

    const { get } = require('lodash')
    const { types, faker, fakerConfig } = require('../utils/faker')
    const createConnection = require('../utils/connection')

    fakerConfig(toolbox)

    async function createSeed (connection, models, key) {
      (await connection
        .createQueryBuilder()
        .insert()
        .into(key)
        .values(generateValue(models[key].fields))
        .execute()
      )
    }

    function handleSeedValues (value) {
      const valuesQuantity = quantity || 25

      return Array.from(Array(valuesQuantity).keys()).map(item => item = value)
    }

    function generateValue (list) {
      const value = {}

      list.forEach(item => {
        value[item.name] = get(faker, item.__seed || types[item.type])()
      })

      return handleSeedValues(value)
    }

    createConnection(toolbox).then(({ connection, models }) => {
      for (const key in models) {
        createSeed(connection, models, key)
      }
    })
  }
}
