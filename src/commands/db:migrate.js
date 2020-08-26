module.exports = {
  name: 'db:migrate',
  alias: ['db:m'],

  run: async toolbox => {
    // Ler os arquivos de models.
    // Converter cada model em entidade do TypeORM (https://github.com/typeorm/javascript-example/blob/master/src/app2-es5-json-schemas/entity/post.json). Não precisa ser em JSON, pode ser objetivo do javascript mesmo.
    // usar o typeorm.createConnection e passar objeto dentro do EntitySchema

    // TODO: apagar o banco quando a opção --reset for passada.
  }
}