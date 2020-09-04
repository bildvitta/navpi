module.exports = {
  name: 'sync',

  run: async toolbox => {
    require('../utils/connection')(toolbox)
  }
}