import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import AppBaseEntity from './AppBaseEntity'
import Battle from './Battle'
import User from './User'

@Entity()
export default class BattleRequest extends AppBaseEntity {
  @ManyToOne(() => Battle, (battle) => battle.battleRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'battleId' })
  battle: Battle

  @Column({ nullable: true })
  battleId: number

  @ManyToOne(() => User, (user) => user.battleRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ nullable: true })
  userId: number

  @Column({ default: false })
  validated: boolean
}
