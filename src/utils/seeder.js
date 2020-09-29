const seederTypes = {
  boolean: '{{random.boolean}}',
  text: '{{lorem.sentence}}',
  number: '{{random.number}}',
  email: '{{internet.email}}',
  checkbox: '{{lorem.word}}',
  color: '{{internet.word}}',
  date: '{{date.recent}}',
  datetime: '{{date.recent}}',
  decimal: '{{random.float}}',
  editor: '{{lorem.paragraphs}}',
  money: '{{commerce.price}}',
  percent: '{{random.float}}',
  radio: '{{random.word}}',
  select: '{{random.sentence}}',
  textarea: '{{random.sentences}}',
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
