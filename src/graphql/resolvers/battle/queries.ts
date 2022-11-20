import { GraphQLError } from 'graphql'
import Battle from '../../../entities/Battle'
import BattleUser from '../../../entities/BattleUser'
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
        relations: { battleUsers: true },
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
      // const now = new Date()
      // const options = {
      //   weekday: 'long',
      //   year: 'numeric',
      //   month: 'long',
      //   day: 'numeric',
      //   hour: 'numeric',
      //   minute: 'numeric',
      // }
      // //@ts-ignore
      // console.log(now.toLocaleDateString('en-US', options))
      // //@ts-ignore
      // console.log(battle.expires.toLocaleDateString('en-US', options))
      // if (battle.status === BattleStatus.ACTIVE) {
      //   if (now.getTime() > battle.expires.getTime()) {
      //     console.log('expired')
      //
      //     battle.status = BattleStatus.OVER
      //     await Battle.save(battle)
      //
      //     const winner = battle.setBattleWinner()
      //     console.log(winner)
      //     if (winner instanceof BattleUser) {
      //       winner.isWinner = true
      //       BattleUser.save(winner)
      //     }
      //   }
      // }
      //
      return battle
    } catch (err) {
      throw new Error(err)
    }
  },
}
