import { userQueries, userMutations } from './user'
import { battleQueries, battleMutations } from './battle'

const resolvers = {
  Query: {
    ...battleQueries,
    ...userQueries,
  },
  Mutation: {
    ...userMutations,
  },
}

export default resolvers
