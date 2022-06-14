import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Need } from '../enum';

@Entity({
  name: 'request',
})
export class RequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  heading: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: false,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  city: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  district: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  volunteerId: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isFinished: boolean;

  @Column({
    type: 'enum',
    enum: Need,
    nullable: false,
  })
  need: Need;
}
