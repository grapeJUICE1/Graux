import { ValidationError } from 'class-validator'

const mapErrors = (errors: ValidationError[]) => {
  let newErrors = []
  errors.forEach((err) => {
    newErrors.push({
      path: err.property,
      message: Object.values(err.constraints)[0],
    })
  })
  return newErrors
}

export default mapErrors
