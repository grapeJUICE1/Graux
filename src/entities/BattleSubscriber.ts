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
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }
    //@ts-ignore
    console.log(now.toLocaleDateString('en-US', options))
    //@ts-ignore
    console.log(entity.expires.toLocaleDateString('en-US', options))
    if (entity.status === BattleStatus.ACTIVE) {
      if (now.getTime() > entity.expires.getTime()) {
        console.log('expired')

        const lel = await event.connection
          .createQueryBuilder()
          .update(Battle)
          .set({ status: BattleStatus.OVER })
          .where('id = :id', { id: entity.id })
          .execute()

        console.log(lel)
        const winner = entity.setBattleWinner()
        console.log(winner)
        if (winner instanceof BattleUser) {
          winner.isWinner = true
          const lell = await event.connection
            .createQueryBuilder()
            .update(BattleUser)
            .set({ isWinner: true })
            .where('id = :id', { id: winner.id })
            .execute()
          console.log(lell)
        }
      }
    }
  }
}
