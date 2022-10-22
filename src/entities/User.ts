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
