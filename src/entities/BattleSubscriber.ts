import { EntitySubscriberInterface, EventSubscriber, LoadEvent } from 'typeorm'
import BattleStatus from '../types/BattleStatusEnum'
import Battle from './Battle'
import BattleUser from './BattleUser'

@EventSubscriber()
export class BattleSubscriber implements EntitySubscriberInterface<Battle> {
  /**
   * Indicates that this subscriber only listen to Battle events.
   */
  listenTo() {
    return Battle
  }
  /**
   * Called after entity is loaded.
   */
  async afterLoad(entity: any, event: LoadEvent<any>) {
    const now = new Date()
    if (entity.status === BattleStatus.ACTIVE) {
      if (now.getTime() > entity.expires.getTime()) {
        await event.connection
          .createQueryBuilder()
          .update(Battle)
          .set({ status: BattleStatus.OVER })
          .where('id = :id', { id: entity.id })
          .execute()

        const winner = entity.setBattleWinner()
        if (winner instanceof BattleUser) {
          winner.isWinner = true
          await event.connection
            .createQueryBuilder()
            .update(BattleUser)
            .set({ isWinner: true })
            .where('id = :id', { id: winner.id })
            .execute()
        }
      }
    }
  }
}
