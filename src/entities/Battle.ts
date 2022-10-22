import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm'
import { User } from './User'

@Entity()
export class Battle {
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
}
