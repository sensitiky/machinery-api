import { PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @UpdateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
