class Validators {
  constructor (modelName) {
    this.expressValidators = []
    this.model = require('../models').getModel(modelName)
  }

  call () {
    this.model.fields.forEach(model => {
      const validators = this.validators()

      for (const key in validators) { validators[key](model) }
    })
  }

  validators () {
    const self = this

    const { body } = require('express-validator')

    return {
      email ({ name }) {
        return name === 'email' && self.expressValidators.push(
          body(name)
            .optional({ checkFalsy: true })
            .isEmail()
            .withMessage('Invalid E-mail.')
        )
      },

      required ({ required, name }) {
        return required && self.expressValidators.push(
          body(name)
            .not()
            .isEmpty()
            .withMessage('Required field.')
        )
      },

      minLength ({ minLength, name }) {
        return minLength && self.expressValidators.push(
          body(name)
            .isLength({ min: minLength })
            .withMessage(`Insert at least ${minLength} char.`)
        )
      },

      maxLength ({ maxLength, name }) {
        return maxLength && self.expressValidators.push(
          body(name)
            .isLength({ max: maxLength })
            .withMessage(`Insert at most ${maxLength} char.`)
        )
      },

      min ({ min, name }) {
        return min && self.expressValidators.push(
          body(name)
            .isInt({ min })
            .withMessage(`The inserted value need to be at least: ${min}.`)
        )
      }
    }
  }
}

module.exports = Validators
