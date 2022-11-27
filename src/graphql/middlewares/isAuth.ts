import { verify } from 'jsonwebtoken'
import config from '../../config/config'
import User from '../../entities/User'
import { GraphQLMiddlewareFunc } from '../../types/graphql-utils'

const isAuthMiddleware: GraphQLMiddlewareFunc = async (
  resolver,
  parent,
  args,
  context,
  info,
  justCheckIfAuthorized: boolean = false
) => {
  let authorized = false

  const authorization = context.req.headers['authorization'] // bearer token
  if (!authorization) {
    if (justCheckIfAuthorized) {
      const result = await resolver(parent, args, context, info)
      return result
    }
    throw new Error('not authenticated')
  }
  try {
    const token = authorization.split(' ')[1]
    console.log('lel', token)
    const payload: any = verify(token, config.ACCESS_TOKEN_SECRET)

    const user = await User.findOne({ where: { id: payload.userId } })

    if (!user) {
      throw new Error('User associated with this token does not exist anymore')
    }

    context.payload = payload
    context.req.user = user
    authorized = true
  } catch (err) {
    console.log(err)
    if (!justCheckIfAuthorized) throw new Error(err)
  }
  if (authorized || justCheckIfAuthorized) {
    const result = await resolver(parent, args, context, info)

    return result
  }
}

export default isAuthMiddleware
