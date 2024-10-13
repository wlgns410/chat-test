import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { BroadcastEntity } from '../../broadcast/entity/broadcast.entity';

@Entity()
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  userId: number;

  @ManyToOne(() => BroadcastEntity, { nullable: false })
  @JoinColumn({ name: 'broadcast_id' })
  broadcast: BroadcastEntity;

  @Column()
  broadcastId: number;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt: Date;
}
