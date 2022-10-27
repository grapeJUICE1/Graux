import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  BaseEntity,
} from 'typeorm'
import Battle from './Battle'

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

  @ManyToMany(() => Battle, (battle) => battle.users)
  battles: Battle[]
}
