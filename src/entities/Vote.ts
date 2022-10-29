import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm'
import User from './User'
import BattleUser from './BattleUser'

@Entity()
export default class Vote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.votes)
  user: User

  @ManyToOne(() => BattleUser, (battleUser) => battleUser.votes)
  battleUser: BattleUser
}
