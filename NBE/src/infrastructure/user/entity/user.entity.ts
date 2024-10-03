import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BroadcastEntity } from '../../broadcast/entity/broadcast.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @OneToOne(() => BroadcastEntity, broadcast => broadcast.user, { nullable: true })
  broadcast: BroadcastEntity;

  @Column({ name: 'broadcast_id', nullable: true })
  broadcastId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastActivity: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'inactive',
    nullable: true,
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['viewer', 'host', 'admin'],
    default: 'viewer',
    nullable: true,
  })
  role: string;
}
