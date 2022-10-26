import Battle from '../../../entities/Battle'

export default {
  async getBattles() {
    try {
      const battles = await Battle.find({
        relations: {
          users: true,
          battleCreatedBy: true,
          winner: true,
        },
      })
      return battles
    } catch (err) {
      throw new Error(err)
    }
  },
}
