const seederTypes = {
  boolean: '{{random.boolean}}',
  checkbox: '{{lorem.word}}',
  color: '{{internet.color}}',
  date: '{{date.recent}}',
  datetime: '{{date.recent}}',
  decimal: '{{random.float}}',
  editor: '{{lorem.paragraphs}}',
  email: '{{internet.email}}',
  money: '{{commerce.price}}',
  number: '{{random.number}}',
  percent: '{{random.float}}',
  radio: '{{lorem.word}}',
  select: '{{lorem.sentence}}',
  text: '{{lorem.sentence}}',
  textarea: '{{lorem.sentences}}',
  time: '{{time.recent}}',
  upload: '{{image.image}}'
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
