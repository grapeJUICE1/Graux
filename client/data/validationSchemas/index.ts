import * as Yup from 'yup'

const emailValidation = Yup.string().email().required('Required')
const usernameValidation = Yup.string()
  .min(3, 'Must be atleaast 3 characters long')
  .max(30, "Can't exceed 30 characters")
  .required('Required')
const passwordValidation = Yup.string()
  .min(8, 'Must be atleaast 8 characters long')
  .max(255, "Can't exceed 255 characters")
  .required('Required')

export const registerSchema = Yup.object({
  email: emailValidation,
  username: usernameValidation,
  password: passwordValidation,
})

export const loginSchema = Yup.object({
  username: usernameValidation,
  password: passwordValidation,
})
