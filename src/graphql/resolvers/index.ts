import { userQueries, userMutations } from './user'
import { battleQueries, battleMutations } from './battle'
import { voteQueries, voteMutations } from './vote'
import { ResolverMap } from '../../types/graphql-utils'

const resolvers: ResolverMap = {
  Query: {
    ...battleQueries,
    ...userQueries,
    ...voteQueries,
  },
  Mutation: {
    ...battleMutations,
    ...userMutations,
    ...voteMutations,
  },
}

export default resolvers
