import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity()
export class BroadcastEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, user => user.broadcast, { nullable: false })
  @JoinColumn()
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: ['live', 'finished'],
    default: 'live',
  })
  status: string;

  @Column({ type: 'bigint', default: 0 })
  viewerCount: number;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean; // 논리적 삭제 플래그
}
