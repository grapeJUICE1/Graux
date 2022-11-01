import { IsDate, Max, Min } from 'class-validator'
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

  @Min(10)
  @Max(255)
  @Column()
  title: string

  @IsDate()
  @Column()
  expires: Date

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
