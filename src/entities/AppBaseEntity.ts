import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

export default abstract class AppBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number
}
