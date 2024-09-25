import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Broadcast } from './broadcast.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
export class BroadcastLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Broadcast, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'broadcast_id' })
  broadcast: Broadcast;

  @Column({ name: 'broadcast_id' })
  broadcastId: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endTime: Date;

  @Column({ type: 'int' })
  viewerCount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  logCreatedAt: Date; // 로그 생성 시간
}
