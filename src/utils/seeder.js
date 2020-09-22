const seederTypes = {
  boolean: '{{random.boolean}}',
  text: '{{lorem.sentence}}',
  number: '{{random.number}}'
}

function getSeeder (toolbox) {
  const { getSettings } = require('./settings')
  const { seeder } = getSettings(toolbox)

  const faker = require('faker')

  if (seeder.locale) {
    faker.locale = seeder.locale
  }

  if (seeder.seed) {
    faker.seed(seeder.seed)
  }

  return faker.fake
}

module.exports = {
  getSeeder,
  seederTypes
}

