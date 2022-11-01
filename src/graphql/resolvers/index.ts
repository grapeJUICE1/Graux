import { userQueries, userMutations } from './user'
import { battleQueries, battleMutations } from './battle'
import { battleUserQueries, battleUserMutations } from './battleUser'
import { voteMutations, voteQueries } from './vote'
import { ResolverMap } from '../../types/graphql-utils'

const resolvers: ResolverMap = {
  Query: {
    ...battleQueries,
    ...userQueries,
    ...battleUserQueries,
    ...voteQueries,
  },
  Mutation: {
    ...battleMutations,
    ...userMutations,
    ...battleUserMutations,
    ...voteMutations,
  },
}

export default resolvers
