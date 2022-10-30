import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  BaseEntity,
  OneToMany,
} from 'typeorm'
import BattleUser from './BattleUser'
import User from './User'

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
  battleUsers: User[]

  @ManyToOne(() => User, (user) => user.battles, {
    onDelete: 'CASCADE',
  })
  battleCreatedBy: User

  @ManyToMany(() => User, (user) => user.battles)
  @JoinTable()
  users: User[]

  @ManyToOne(() => User, (user) => user.battles)
  winner: User
}
