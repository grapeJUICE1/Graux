import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  BaseEntity,
} from 'typeorm'
import { User } from './User'

@Entity()
export class Battle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ generated: 'uuid' })
  uuid: string

  @Column()
  title: string

  @Column()
  votingTill: Date

  @ManyToMany(() => User, (user) => user.battles)
  @JoinTable()
  users: User[]

  @ManyToOne(() => User, (user) => user.battles)
  winner: User
}
