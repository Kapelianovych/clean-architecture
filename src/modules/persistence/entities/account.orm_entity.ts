import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Account', {})
export class AccountOrmEntity {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  id: number;
  @Column()
  // @ts-ignore
  userId: string;
}
