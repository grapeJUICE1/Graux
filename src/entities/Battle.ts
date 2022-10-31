import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm'
import BattleUser from './BattleUser'

@Entity()
export default class Battle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ generated: 'uuid' })
  uuid: string

  @Column()
  title: string

  @Column()
  expires: Date

  @OneToMany(() => BattleUser, (battleUser) => battleUser.battle)
  battleUsers: BattleUser[]

  public get getBattleCreator() {
    const battleUser = this.battleUsers.find(
      (battleUser) => battleUser.battleCreator === true
    )
    return battleUser.user
  }
}
