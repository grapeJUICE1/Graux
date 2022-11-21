import { Column, Entity, ManyToOne } from 'typeorm'
import AppBaseEntity from './AppBaseEntity'
import Battle from './Battle'
import User from './User'

@Entity()
export default class BattleRequest extends AppBaseEntity {
  @ManyToOne(() => Battle, (battle) => battle.battleRequests, {
    onDelete: 'CASCADE',
  })
  battle: Battle

  @ManyToOne(() => User, (user) => user.battleRequests, {
    onDelete: 'CASCADE',
  })
  user: User

  @Column({ default: false })
  validated: boolean
}
