import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Activity', {})
export class ActivityOrmEntity {
  @PrimaryGeneratedColumn()
  //@ts-ignore
  id: number;

  @Column()
  //@ts-ignore
  timestamp: number;

  @Column()
  //@ts-ignore
  ownerAccountId: string;

  @Column()
  //@ts-ignore
  sourceAccountId: string;

  @Column()
  //@ts-ignore
  targetAccountId: string;

  @Column()
  //@ts-ignore
  amount: number;
}
