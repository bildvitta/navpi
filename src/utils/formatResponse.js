function filterPrivates (object) {
  const public = {}

  for (const key in object) {
    if (!key.startsWith('__')) {
      public[key] = object[key]
    }
  }

  return public
}

function onError (errorsToFormat, context = {}) {
  const errors = {}

  errorsToFormat.forEach(({ msg, param }) => {
    if (Object.prototype.hasOwnProperty.call(errors, param)) {
      return errors[param].push(msg)
    }

    errors[param] = [msg]
  })

  return {
    errors,
    status: { code: 400 },
    ...context
  }
}

function onSuccess (modelName, context = {}) {
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

function filterPrivatesInArray (list) {
  return list.map(item => filterPrivates(item))
}

function formatResponse ({ modelName, context = {}, errors } = {}) {
  if (errors) { return onError(errors, context) }

  if (!modelName) {
    throw new Error('Please provide a valid model name.')
  }

  return onSuccess(modelName, context)
}

module.exports = formatResponse
