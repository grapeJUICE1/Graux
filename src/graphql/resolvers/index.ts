import battleResolvers from './battleResolvers'
import userResolvers from './userResolvers'

const resolvers = {
  Query: {
    ...battleResolvers.Query,
    ...userResolvers.Query,
  },
}

export default resolvers
