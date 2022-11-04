import { userQueries, userMutations } from './user'
import { battleQueries, battleMutations } from './battle'
import { battleUserQueries, battleUserMutations } from './battleUser'
import { voteMutations, voteQueries } from './vote'
import { ResolverMap } from '../../types/graphql-utils'
import { commentMutations, commentQueries } from './comment'
import { likeDislikeMutations, likeDislikeQueries } from './likeDislike'

const resolvers: ResolverMap = {
  BattleOrComment: {
    __resolveType(obj) {
      if (obj.title) {
        return 'Battle'
      }

      if (obj.body) {
        return 'Comment'
      }
      return null
    },
  },
  Query: {
    ...battleQueries,
    ...userQueries,
    ...battleUserQueries,
    ...voteQueries,
    ...commentQueries,
    ...likeDislikeQueries,
  },
  Mutation: {
    ...battleMutations,
    ...userMutations,
    ...battleUserMutations,
    ...voteMutations,
    ...commentMutations,
    ...likeDislikeMutations,
  },
}

export default resolvers
