import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseModel } from './base-model.entity';
import { Product } from './product.entity';
import { MemberType } from './member-type.entity';

/**
 * Member Type에 따른 가격을 저장하는 엔티티
 */
@Unique(['productId', 'memberTypeId'])
@Entity()
export class MemberTypePrice extends BaseModel {
  @Column()
  price: number;

  @Column()
  productId: string;

  @Column()
  memberTypeId: string;

  @ManyToOne(() => Product, (product) => product.memberTypePrices)
  product: Product;

  @ManyToOne(() => MemberType, (memberType) => memberType.memberTypePrices)
  memberType: MemberType;
}
