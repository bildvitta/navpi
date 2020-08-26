const defaults = {
  database: {
    dialect: 'sqlite',
    storage: 'database.sqlite'
  },

  seeder: {},

  server: {
    port: 5051
  }
}

function getSettings (toolbox) {
  const {
    config: { loadConfig },
    runtime: { brand }
  } = toolbox

  try {
    return {
      ...loadConfig(brand, process.cwd()),
      ...defaults
    }
  } catch (error) {
    return defaults
  }
}

module.exports = {
  getSettings
}
