module.exports = {
  name: 'db:migrate',
  alias: ['db:m'],

  run: async toolbox => {
    const {
      filesystem,
      print: { error }
    } = toolbox

    const path = filesystem.path('models') + '/'
    const tree = filesystem.inspectTree(path)

    if (!tree) { return error('Can not find path models') }

    const YAML = require('yaml')
    const types = ['yml', 'json']
    const files = {}

    const typeorm = require('typeorm')
    const EntitySchema = typeorm.EntitySchema
    const { getSettings } = require('../utils/settings')

    const typeORMConvert = {
      boolean: 'boolean',
      checkbox: 'varchar',
      color: 'varchar',
      date: 'date',
      datetime: 'datetime',
      decimal: 'decimal',
      editor: 'text',
      money: 'decimal',
      number: 'int',
      percent: 'decimal',
      radio: 'varchar',
      select: 'varchar',
      text: 'varchar',
      textarea: 'text',
      time: 'varchar',
      upload: 'varchar'
    }

    tree.children.filter(({ name }) => {
      return types.includes(name.split('.')[1])
    }).forEach(({ name }) => {
      const key = name.split('.')[0]
      const object = filesystem.read(path + name)
      files[key] = name.includes('.yml') ? YAML.parse(object) : JSON.parse(object)
    })

    for (const key in files) {
      files[key].fields = files[key].fields.map(file => {
        file.type = typeORMConvert[file.type]

        return file
      })
    }

    const entities = toEntity(files)

    function toEntity (files) {
      const list = []

      for (const key in files) {
        const entity = {}
        entity.name = key.charAt(0).toUpperCase() + key.slice(1)

        files[key].fields.forEach((item, index) => {
          const { name, ...rest } = item

          entity.columns = {
            ...entity.columns,
            [name]: { ...rest }
          }

          if (!index) {
            entity.columns.name.primary = true
            entity.columns.name.generated = true
          }
        })

        list.push(new EntitySchema(entity))
      }

      return list
    }


    // console.log(entities)
    // entities[0].columns.name.primary = true
    // const test = entities[0]
    // console.log(test)

    typeorm.createConnection({
      // ...getSettings(toolbox),
      type: 'sqlite',
      host: 'localhost',
      port: 5050,
      username: 'test',
      password: 'test',
      database: 'test',
      synchronize: true,

      entities: [
          // new EntitySchema(test)
        ...entities
      ]
    }).then(connection => console.log(connection))

    // for (const key in files) {  }
    // console.log(files)
    // Ler os arquivos de models.
    // Converter cada model em entidade do TypeORM (https://github.com/typeorm/javascript-example/blob/master/src/app2-es5-json-schemas/entity/post.json). Não precisa ser em JSON, pode ser objetivo do javascript mesmo.
    // usar o typeorm.createConnection e passar objeto dentro do EntitySchema

    // TODO: apagar o banco quando a opção --reset for passada.
  }
}