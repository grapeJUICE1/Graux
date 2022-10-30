import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  BaseEntity,
  OneToMany,
} from 'typeorm'
import Battle from './Battle'
import BattleUser from './BattleUser'

@Entity('users')
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  username: string

  @Column()
  password: string

  @Column('int', { default: 0 })
  tokenVersion: number

  @OneToMany(() => BattleUser, (battleUser) => battleUser.user)
  battleSongs: BattleUser[]

  @ManyToMany(() => Battle, (battle) => battle.users)
  battles: Battle[]
}
