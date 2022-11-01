import { GraphQLError } from 'graphql'

export default class AppError extends GraphQLError {
  constructor(
    message: string,
    errors: { path: string; message: string }[],
    code: string = 'BAD_USER_INPUT'
  ) {
    super(message)
    this.extensions.errors = errors
    this.extensions.code = code
    Error.captureStackTrace(this, this.constructor)
  }
}
