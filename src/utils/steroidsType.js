function handleFields (model) {
  const fields = {}

  model.fields.forEach(item => {
    const { __seed , ...field } = item

    fields[item.name] = { ...field }
  })

  return fields
}

function steroidsType (model, results, metadata = {}) {
  return {
    fields: handleFields(model),
    results,
    metadata
  }
}

module.exports = steroidsType
