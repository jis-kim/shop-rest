import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseModel } from './base-model.entity';
import { MemberType } from './member-type.entity';

@Entity()
export class Member extends BaseModel {
  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column()
  memberTypeId: string;

  @ManyToOne(() => MemberType, (memberType) => memberType.members)
  memberType: MemberType;
}
