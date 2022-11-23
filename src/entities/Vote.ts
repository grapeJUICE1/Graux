import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import User from './User'
import BattleUser from './BattleUser'
import AppBaseEntity from './AppBaseEntity'

@Entity()
export default class Vote extends AppBaseEntity {
  @ManyToOne(() => User, (user) => user.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ nullable: true })
  userId: number

  @ManyToOne(() => BattleUser, (battleUser) => battleUser.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'battleUserId' })
  battleUser: BattleUser

  @Column({ nullable: true })
  battleUserId: number
}
