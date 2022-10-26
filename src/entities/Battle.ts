import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  BaseEntity,
} from 'typeorm'
import User from './User'

@Entity()
export default class Battle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ generated: 'uuid' })
  uuid: string

  @Column({ unique: true })
  title: string

  @Column()
  votingTill: Date

  @ManyToOne(() => User, (user) => user.battles)
  battleCreatedBy: User

  @ManyToMany(() => User, (user) => user.battles)
  @JoinTable()
  users: User[]

  @ManyToOne(() => User, (user) => user.battles)
  winner: User
}
