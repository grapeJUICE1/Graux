import { GraphQLError } from 'graphql'
import Battle from '../../../entities/Battle'
import BattleStatus from '../../../types/BattleStatusEnum'

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

  async getBattle(_: any, { battleId }) {
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
      const now = new Date()

      if (now.getTime() > battle.expires.getTime()) {
        console.log('expired')

        battle.status = BattleStatus.OVER
        Battle.save(battle)
      }
      return battle
    } catch (err) {
      throw new Error(err)
    }
  },
}
