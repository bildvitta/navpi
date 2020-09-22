class AppError {
  constructor (errors = {}) {
    this.errors = {
      status: {
        code: 400
      },
      ...errors
    }
  }
}

module.exports = AppError
