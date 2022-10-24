import { verify } from 'jsonwebtoken'
import config from '../../config/config'
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
    const payload = verify(token, config.ACCESS_TOKEN_SECRET)
    console.log(payload)
    context.payload = payload as any
    const result = await resolver(parent, args, context, info)

    return result
  } catch (err) {
    console.log(err)
    throw new Error('not authenticated')
  }
}

export default isAuthMiddleware
