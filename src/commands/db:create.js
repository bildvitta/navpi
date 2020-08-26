module.exports = {
  name: 'db:create',
  alias: ['db:c'],

  run: async toolbox => {
    // Cria o banco se não existir.
    // ATENÇÃO: acredito que o createConnection que estará no migrate já faça esse trabalho, verificar e, se for verdade, descartar esse comando de criar.
  }
}