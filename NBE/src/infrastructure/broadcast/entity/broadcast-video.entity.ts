import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { BroadcastEntity } from './broadcast.entity';

@Entity() // vod
export class BroadcastVideoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => BroadcastEntity, { nullable: true })
  @JoinColumn({ name: 'broadcast_id' })
  broadcast: BroadcastEntity;

  @Column()
  broadcastId: number;

  @Column({ type: 'text', nullable: true })
  vodUrl: string; // VOD 영상 URL

  @Column({ type: 'text', nullable: true })
  subtitleUrl: string;
}
