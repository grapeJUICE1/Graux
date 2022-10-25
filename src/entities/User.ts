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

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column('int', { default: 0 })
  tokenVersion: number

  @ManyToMany(() => Battle, (battle) => battle.users)
  battles: Battle[]
}
