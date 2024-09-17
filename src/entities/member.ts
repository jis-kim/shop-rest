import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseModel } from './base-model.entity';
import { MemberType } from './member-type.entity';

@Entity()
export class Member extends BaseModel {
  @Column('varchar', { length: 128 })
  name: string;

  @Column('varchar', { length: 128 })
  username: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column()
  memberTypeId: string;

  @ManyToOne(() => MemberType, (memberType) => memberType.members)
  memberType: MemberType;
}
