import { verify } from 'jsonwebtoken'
import config from '../../config/config'
import User from '../../entities/User'
import { GraphQLMiddlewareFunc } from '../../types/graphql-utils'

const isAuthMiddleware: GraphQLMiddlewareFunc = async (
  resolver,
  parent,
  args,
  context,
  info
) => {
  const authorization = context.req.headers['authorization'] // bearer token

  if (!authorization) {
    throw new Error('not authenticated')
  }
  try {
    const token = authorization.split(' ')[1]
    const payload: any = verify(token, config.ACCESS_TOKEN_SECRET)

    const user = await User.find({ where: { id: payload.userId } })

    if (!user) {
      throw new Error('User associated with this token does not exist anymore')
    }

    context.payload = payload
    context.req.user = user

    const result = await resolver(parent, args, context, info)

    return result
  } catch (err) {
    console.log(err)
    throw new Error('not authenticated')
  }
}

export default isAuthMiddleware
