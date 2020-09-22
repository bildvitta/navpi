const AppError = require('./AppError')

const globalErrorHandler = (errorRequest, request, response, next) => {
  if (errorRequest instanceof AppError) {
    return response.status(errorRequest.errors.status.code).json(errorRequest.errors)
  }

  return response.status(500).json({
    code: 500,
    text: 'Internal server error.'
  })
}

module.exports = globalErrorHandler
