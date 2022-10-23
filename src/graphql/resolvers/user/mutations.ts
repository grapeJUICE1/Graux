import { hash, verify } from 'argon2'
import { sign } from 'jsonwebtoken'
import User from '../../../entities/User'
import MyContext from '../../../MyContext'

export default {
  async register(_, { username, email, password }, context) {
    try {
      console.log(context)
      const checkIfUserExists = await User.findOne({
        where: { username },
      })
      if (checkIfUserExists) {
        return { error: 'User already exists' }
      }

      const hashedPassword = await hash(password)
      await User.insert({
        username,
        email,
        password: hashedPassword,
      })

      return 'it happened woohoo'
    } catch (err) {
      console.log(err)
    }
  },

  async login(_, { username, email, password }, { res }: MyContext) {
    try {
      const user = await User.findOne({ where: { username } })

      if (!user) {
        return { error: 'User was not found' }
      }

      const isPasswordCorrect = await verify(user.password, password)

      if (!isPasswordCorrect) {
        return { error: 'password was incorrect' }
      }

      //login successful

      res.cookie(
        'lit',
        sign({ userId: user.id }, 'solosososlso', {
          expiresIn: '7d',
        }),
        {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        }
      )

      return {
        accessToken: sign({ userId: user.id }, 'lololololol', {
          expiresIn: '15m',
        }),
      }
    } catch (err) {
      console.log(err)
    }
  },
}
