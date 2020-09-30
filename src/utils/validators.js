const { body } = require('express-validator')

const validators = {
  email ({ type, name }) {
    return type === 'email' && body(name).optional({ checkFalsy: true }).isEmail().withMessage('Invalid E-mail.')
  },

  required ({ required, name }) {
    return required && body(name).not().isEmpty().withMessage('Required field.')
  },

  minLength ({ minLength, name }) {
    return minLength && body(name).isLength({ min: minLength }).withMessage(`Insert at least ${minLength} char.`)
  },

  maxLength ({ maxLength, name }) {
    return maxLength && body(name).isLength({ max: maxLength }).withMessage(`Insert at most ${maxLength} char.`)
  },

  min ({ min, name }) {
    return min && body(name).isInt({ min }).withMessage(`The inserted value need to be at least: ${min}.`)
  }
}

function handleValidations (modelName) {
  const expressValidators = []
  const model = require('./models').getModel(modelName)

  model.fields.forEach(field => {
    for (const key in validators) {
      const validation = validators[key](field)

      validation && expressValidators.push(validation)
    }
  })

  return expressValidators
}

module.exports = handleValidations
