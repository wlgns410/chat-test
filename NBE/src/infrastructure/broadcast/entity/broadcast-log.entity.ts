import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BroadcastEntity } from './broadcast.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Entity()
export class BroadcastLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BroadcastEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'broadcast_id' })
  broadcast: BroadcastEntity;

  @Column()
  broadcastId: number;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
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
