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

    this.validators = {
      'min-length': this.minLegth
    }
  }

  minLegth (value, model, length) {
    value.length > length && this.setError(model, `Este campo precisa de no mínimo ${length} caracteres`)
  }

  maxLength (value, model, length) {
    value.length < length && this.setError(model, `Este campo precisa de no maximo ${length} caracteres`)
  }

  setError (model, value) {
    this.errors[model] = [value]
  }

  required (model, value) {
    console.log('fui chamado', model, value)
    !value.length && this.setError(model, 'Campo obrigatório')
  }

  validate (field) {
    const blankTypes = [null, undefined, '']

    this.fields.forEach(item => {
      if (item.required) {
        this.required(item.name, field[item.name])
      }

      console.log(this.errors, '>>>> errosssssss')

      return this.errors
    })
  }
}

module.exports = Validator