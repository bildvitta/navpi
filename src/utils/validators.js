class Validator {
  constructor (fields) {
    this.fields = fields
    this.errors = {}

    this.requiredValidations = [
      'minLength',
      'maxLength',
      'required',
      'readonly'
    ]
  }

  validators () {
    return {
      minLegth (model, value, length) {
        value.length > length && this.setError(model, `Este campo precisa de no mínimo ${length} caracteres`)
      },

      maxLength (model, value, length) {
        value.length < length && this.setError(model, `Este campo precisa de no maximo ${length} caracteres`)
      },

      required (model, value) {
        !value.length && this.setError(model, 'Campo obrigatório')
      }
    }
  }

  setError (model, value) {
    this.errors[model] = [value]
  }

  validate (field) {
    const blankTypes = [null, undefined, '']

    this.fields.forEach(item => {
      if (item.required) {
        this.required(item.name, field[item.name])
      }

      console.log(this.this.fields, '>>>> errosssssss')

      return this.errors
    })
  }
}

module.exports = Validator
