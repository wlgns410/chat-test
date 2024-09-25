import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Broadcast } from '../../broadcast/entity/broadcast.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @OneToOne(() => Broadcast, broadcast => broadcast.user, { nullable: true })
  broadcast: Broadcast;

  @Column({ name: 'broadcast_id' })
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
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['viewer', 'host', 'admin'],
    default: 'viewer',
  })
  role: string;
}
