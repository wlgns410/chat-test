import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity()
export class BroadcastEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, user => user.broadcast, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  userId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['scheduled', 'live', 'off_air'],
    default: 'off_air',
  })
  status: string;

  @Column({ type: 'bigint', default: 1 })
  viewerCount: number; // 방송하는 사람 있으니 기본값 1

  @Column({ type: 'timestamptz', nullable: true })
  scheduledTime: Date; // 방송 예정시간

  @Column({ type: 'simple-array', nullable: true })
  tags: string[]; // 태그를 여러개 작성할 수 있도록

  @Column({ type: 'text', nullable: true })
  thumbnailUrl: string; // 방송 썸네일
}
