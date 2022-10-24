import { GraphQLMiddlewareFunc, Resolver } from '../types/graphql-utils'

// const middleware = async (
//   resolver,
//   parent: any,
//   args: any,
//   context: any,
//   info: any
// ) => {
//   //middleware
//   const result = await resolver(parent, args, context, info)
//   //afterware
//
//   return result
// }

const addMiddleware = (
  middlewareToAdd: GraphQLMiddlewareFunc,
  resolver: Resolver
) => {
  return (parent: any, args: any, context: any, info: any) =>
    middlewareToAdd(resolver, parent, args, context, info)
}

export default addMiddleware
