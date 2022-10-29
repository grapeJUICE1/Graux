import { userQueries, userMutations } from './user'
import { battleQueries, battleMutations } from './battle'
import { ResolverMap } from '../../types/graphql-utils'

const resolvers: ResolverMap = {
  Query: {
    ...battleQueries,
    ...userQueries,
  },
  Mutation: {
    ...userMutations,
    ...battleMutations,
  },
}

export default resolvers
