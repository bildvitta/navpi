function filterPrivates (object) {
  const public = {}

  for (const key in object) {
    if (!key.startsWith('__')) {
      public[key] = object[key]
    }
  }

  return public
}

function filterPrivatesInArray (list) {
  return list.map(item => filterPrivates(item))
}

function formatResponse (modelName, context = {}) {
  if (!modelName) {
    throw new Error('Please provide a valid model name.')
  }

  function run (object) {
    if (!Object.keys(object).length) {
      return undefined
    }

    const entries = {}

    for (const key in object) {
      const item = object[key]
      entries[key] = typeof item === 'function' ? item(context) : item
    }

    return entries
  }

  const model = require('./models').models[modelName]

  const response = {
    result: context.result || undefined,
    results: context.results || undefined,
    count: context.count || undefined
  }

  response.fields = filterPrivatesInArray([
    ...(model.fields || []),
    ...(context.fields || [])
  ])

  response.metadata = run({
    ...(model.metadata || {}),
    ...(context.metadata || {})
  })

  response.status = {
    code: 200
  }

  return response
}

module.exports = formatResponse
