import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm'
import BattleUser from './BattleUser'
import Vote from './Vote'

@EventSubscriber()
export class VoteSubscriber implements EntitySubscriberInterface<Vote> {
  listenTo() {
    return Vote
  }
  async afterInsert(event: InsertEvent<Vote>) {
    try {
      const voteCount = await Vote.count({
        relations: { battleUser: true },
        where: { battleUser: { id: event.entity.battleUser.id } },
      })
      event.entity.battleUser.voteCount = voteCount
      await BattleUser.save(event.entity.battleUser)
    } catch (err) {
      throw new Error(err)
    }
  }

  async beforeRemove(event: RemoveEvent<Vote>) {
    try {
      const voteCount = await Vote.count({
        relations: { battleUser: true },
        where: { battleUser: { id: event.entity.battleUser.id } },
      })
      event.entity.battleUser.voteCount = voteCount - 1
      await BattleUser.save(event.entity.battleUser)
    } catch (err) {
      throw new Error(err)
    }
  }
}
