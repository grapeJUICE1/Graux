import { IsDate, Length, Max, Min } from 'class-validator'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm'
import BattleUser from './BattleUser'
import BattleStatus from '../types/BattleStatusEnum'

@Entity()
export default class Battle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ generated: 'uuid' })
  uuid: string

  @Length(10, 255)
  @Column()
  title: string

  @Column({ nullable: true })
  expires: Date

  @Column({
    type: 'enum',
    enum: BattleStatus,
    default: BattleStatus.CREATION,
  })
  status: BattleStatus

  @OneToMany(() => BattleUser, (battleUser) => battleUser.battle)
  battleUsers: BattleUser[]

  public get getBattleCreator() {
    console.log(this)
    const battleUser = this.battleUsers.find(
      (battleUser) => battleUser.battleCreator === true
    )
    return battleUser.user
  }
}
