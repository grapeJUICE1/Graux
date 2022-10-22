import Battle from '../../entities/Battle'

const resolvers = {
  Query: {
    async getBattles() {
      try {
        const battles = await Battle.find()
        return battles
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}

export default resolvers
