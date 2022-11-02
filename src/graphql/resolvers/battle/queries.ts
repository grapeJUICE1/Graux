import { GraphQLError } from 'graphql'
import Battle from '../../../entities/Battle'

export default {
  async getBattles() {
    try {
      const battles = await Battle.find({
        relations: { battleUsers: { user: true } },
      })
      return battles
    } catch (err) {
      throw new Error(err)
    }
  },

  async getBattle(battleId: number) {
    try {
      const battle = await Battle.findOne({
        where: { id: battleId },
      })
      if (!battle) {
        return new GraphQLError('Validation Error', {
          extensions: {
            errors: [
              { path: 'battle', message: 'Battle with that id was not found' },
            ],
            code: 'BAD_USER_INPUT',
          },
        })
      }
      if (Date.now() > Number(battle.expires)) {
        console.log('expired')
      }
      return battle
    } catch (err) {
      throw new Error(err)
    }
  },
}
