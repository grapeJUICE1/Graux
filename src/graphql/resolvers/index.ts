import { userQueries, userMutations } from './user'
import { battleQueries, battleMutations } from './battle'
import { ResolverMap } from '../../types/graphql-utils'
import addMiddleware from '../../utils/addMiddleware'
import isAuthMiddleware from '../middlewares/isAuth'

const resolvers: ResolverMap = {
  Query: {
    ...battleQueries,
    ...userQueries,
    test: addMiddleware(isAuthMiddleware, (_, {}, context) => {
      return `your id ${context.payload.userId}`
    }),
  },
  Mutation: {
    ...userMutations,
    ...battleMutations,
  },
}

export default resolvers
