import { Entity, ManyToOne } from 'typeorm'
import User from './User'
import BattleUser from './BattleUser'
import AppBaseEntity from './AppBaseEntity'

@Entity()
export default class Vote extends AppBaseEntity {
  @ManyToOne(() => User, (user) => user.votes)
  user: User

  @ManyToOne(() => BattleUser, (battleUser) => battleUser.votes)
  battleUser: BattleUser
}
