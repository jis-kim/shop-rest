import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from './base-model.entity';
import { Member } from './member';
import { MemberTypePrice } from './member-type-price.entity';

@Entity()
export class MemberType extends BaseModel {
  @Column({ type: 'varchar', length: 128, unique: true })
  name: string;

  @OneToMany(() => Member, (member) => member.memberType)
  members: Member[];

  @OneToMany(() => MemberTypePrice, (memberTypePrice) => memberTypePrice.memberType)
  memberTypePrices: MemberTypePrice[];
}
