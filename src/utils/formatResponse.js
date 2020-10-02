function filterPrivates (object) {
  const public = {}

  for (const key in object) {
    if (!key.startsWith('__')) {
      public[key] = object[key]
    }
  }

  return public
}

function onErrorResponse (errorsToFormat, context = {}) {
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

/**
 * @param {object} model model to filter
 * @returns {object} return erros if existis
 */
function filterErrorsFromModel (model) {
  if (!model) {
    throw new Error('Please provide a model')
  }

  const errors = {}

  for (const key in model.fields) {
    const error = model.fields[key].__errors

    if (error) {
      errors[key] = error
    }
  }

  return Object.keys(errors).length ? errors : undefined
}

function onSuccessResponse (modelName, context = {}, enableError = true) {
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
    count: context.count || undefined,
    errors: enableError ? (context.errors || filterErrorsFromModel(model)) : undefined
  }

  response.fields = filterPrivatesInObject({
    ...(model.fields || {}),
    ...(context.fields || {})
  })

  response.metadata = run({
    ...(model.metadata || {}),
    ...(context.metadata || {})
  })

  response.status = {
    code: 200
  }

  return response
}

function filterPrivatesInObject (object) {
  const fields = {}

  for (const key in object) {
    fields[key] = { ...filterPrivates(object[key]) }
  }

  return fields
}

module.exports = {
  onSuccessResponse,
  onErrorResponse
}
