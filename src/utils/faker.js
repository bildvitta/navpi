const faker = require('faker')

const types = {
  boolean: 'random.boolean',
  text: 'lorem.sentence'
}

function fakerConfig (toolbox) {
  const { getSettings } = require('./settings')
  const { seeder } = getSettings(toolbox)

  faker.locale = seeder.locale
}

module.exports = {
  fakerConfig,
  types,
  faker
}

