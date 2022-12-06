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

const hoursValidation = Yup.number()
  .min(1, 'battle has to be active for atleast 1 hour')
  .max(168, 'battle cannot be active for more than 7 days or 168 hours')
  .required()
  .positive()
  .integer()

const titleValidation = Yup.string()
  .min(10, 'Title has to be atleast 10 chars long')
  .max(255, "Title can't exceed 255 characters")
  .required()

export const registerSchema = Yup.object({
  email: emailValidation,
  username: usernameValidation,
  password: passwordValidation,
})

export const loginSchema = Yup.object({
  username: usernameValidation,
  password: passwordValidation,
})

export const createBattleSchema = Yup.object({ title: titleValidation })

export const addBattleUserSchema = Yup.object({ username: usernameValidation })

export const startBattleSchema = Yup.object({ hours: hoursValidation })
