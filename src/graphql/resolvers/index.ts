import { userQueries, userMutations } from './user'
import { battleQueries, battleMutations } from './battle'
import { battleUserQueries, battleUserMutations } from './battleUser'
import { voteMutations, voteQueries } from './vote'
import { ResolverMap } from '../../types/graphql-utils'
import { commentMutations, commentQueries } from './comment'

const resolvers: ResolverMap = {
  Query: {
    ...battleQueries,
    ...userQueries,
    ...battleUserQueries,
    ...voteQueries,
    ...commentQueries,
  },
  Mutation: {
    ...battleMutations,
    ...userMutations,
    ...battleUserMutations,
    ...voteMutations,
    ...commentMutations,
  },
}

export default resolvers
