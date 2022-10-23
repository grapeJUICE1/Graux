import Battle from '../../../entities/Battle'

export default {
  async getBattles() {
    try {
      const battles = await Battle.find()
      return battles
    } catch (err) {
      throw new Error(err)
    }
  },
}
