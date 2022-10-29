import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm'
import BattleUser from './BattleUser'
import Vote from './Vote'

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

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[]
  // @ManyToMany(() => Battle, (battle) => battle.users)
  // battles: Battle[]
}
