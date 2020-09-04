const defaults = {
  database: {
    type: 'sqlite',
    database: 'database.sqlite'
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
      ...defaults,
      ...loadConfig(brand, process.cwd())
    }
  } catch (error) {
    return defaults
  }
}

module.exports = {
  getSettings
}
