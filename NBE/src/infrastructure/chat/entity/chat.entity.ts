import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Broadcast } from '../../broadcast/entity/broadcast.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Broadcast, { nullable: false })
  broadcast: Broadcast;

  @Column({ name: 'broadcast_id' })
  broadcastId: number;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt: Date;
}
