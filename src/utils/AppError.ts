class AppError extends Error {
  isOperational: boolean
  msg: string
  constructor(message: string) {
    super(message)
    this.isOperational = true
    this.msg = message
    // Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
