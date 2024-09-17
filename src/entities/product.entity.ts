import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from './base-model.entity';
import { Brand } from './brand.entity';
import { MemberTypePrice } from './member-type-price.entity';

@Entity()
export class Product extends BaseModel {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  basePrice: number;

  // 100이 올 수도 있으니까 4자리..
  @Column({ type: 'numeric', precision: 4, scale: 1, default: 0 })
  discountRate: number;

  @Column()
  brandId: string;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @OneToMany(() => MemberTypePrice, (memberTypePrice) => memberTypePrice.product)
  memberTypePrices: MemberTypePrice[];
}
