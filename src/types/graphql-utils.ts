import MyContext from '../MyContext'

export type Resolver = (
  parent: any,
  args: any,
  context: MyContext,
  info: any
) => any

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver
  }
}

export type GraphQLMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: MyContext,
  info: any,
  additionalMiddlewareArg: any
) => any
