import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Battle } from './Battle'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ unique: true })
  username: string

  @Column({ select: false })
  password: string

  @ManyToMany(() => Battle, (battle) => battle.users)
  battles: Battle[]
}
