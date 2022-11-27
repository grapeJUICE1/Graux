import { GraphQLMiddlewareFunc, Resolver } from '../types/graphql-utils'

const addMiddleware = (
  middlewareToAdd: GraphQLMiddlewareFunc,
  resolver: Resolver,
  additionalMiddlewareArg: any = undefined
) => {
  return (parent: any, args: any, context: any, info: any) =>
    middlewareToAdd(
      resolver,
      parent,
      args,
      context,
      info,
      additionalMiddlewareArg
    )
}

export default addMiddleware
