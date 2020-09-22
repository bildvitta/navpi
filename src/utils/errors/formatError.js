function formatError (errorsToFormat) {
  const errors = {}

  errorsToFormat.forEach(({ msg, param }) => {
    if (Object.prototype.hasOwnProperty.call(errors, param)) {
      return errors[param].push(msg)
    }

    errors[param] = [msg]
  })

  return errors
}

module.exports = formatError
