import { Product } from '@/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProductQueryDto } from './dto/get-product-query.dto';
import { ProductInfo, ProductResponseDto } from './dto/product-response.dto';
import { MemberContext } from '@/common/types/member-context.type';
import { TokenPayload } from '@/auth/types/token-payload.type';

const MONDAY_DISCOUNT_RATE = 1;

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(query: GetProductQueryDto, memberContext: MemberContext): Promise<ProductResponseDto> {
    if (query.limit === undefined) {
      query.limit = 10;
    }
    if (query.page === undefined) {
      query.page = 1;
    }

    if (memberContext.isAuthenticated) {
      // member type에 따른 price 를 표시한다.
      return this.getProductsByMemberType(query, memberContext.payload);
    }
    // 비회원의 경우 price 를 표시하지 않는다.
    return this.getProductsWithoutPrice(query);
  }

  private async getProductsByMemberType(query: GetProductQueryDto, payload: TokenPayload): Promise<ProductResponseDto> {
    const { page, limit, brandName } = query;
    const { memberTypeId } = payload;

    const [products, total] = await this.productRepository.findAndCount({
      select: ['name', 'description', 'basePrice', 'discountRate', 'brand'],
      where: [
        brandName ? { brand: [{ name: brandName }, { nameEn: brandName }] } : undefined,
        { memberTypePrices: { memberTypeId } },
      ],
      skip: (page - 1) * limit,
      take: limit,
      relations: ['memberTypePrices', 'brand'], // left join 하므로 memberTypePrices가 없어도 조회됨
    });

    const productInfoList = products.map((product): ProductInfo => {
      const { basePrice, discountedPrice, totalDiscountRate } = this.calculatePrice(product, memberTypeId);
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        brand: {
          id: product.brand.id,
          name: product.brand.name,
          nameEn: product.brand.nameEn,
        },
        basePrice,
        discountedPrice,
        totalDiscountRate,
      };
    });

    return {
      items: productInfoList,
      meta: {
        totalItems: total,
        itemCount: products.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  /**
   * 로그인 하지 않은 사용자의 경우 price 정보를 제공하지 않는다.
   * brandName이 주어진 경우 해당 브랜드의 상품 목록을 조회한다.
   *
   * @param query - 상품 목록 조회 query (page, limit, brandName)
   * @returns
   */
  private async getProductsWithoutPrice(query: GetProductQueryDto): Promise<ProductResponseDto> {
    const { page, limit, brandName } = query;

    const [products, total] = await this.productRepository.findAndCount({
      select: ['name', 'description', 'brand'],
      where: brandName ? { brand: [{ name: brandName }, { nameEn: brandName }] } : undefined,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['brand'],
    });

    const productInfoList = products.map(
      (product): ProductInfo => ({
        id: product.id,
        name: product.name,
        description: product.description,
        brand: {
          id: product.brand.id,
          name: product.brand.name,
          nameEn: product.brand.nameEn,
        },
      }),
    );

    return {
      items: productInfoList,
      meta: {
        totalItems: total,
        itemCount: products.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  // price 정보들을 결정하는 함수
  private calculatePrice(product: Product, memberTypeId: string) {
    const memberTypePrice = product.memberTypePrices.find((price) => price.memberTypeId === memberTypeId);
    const basePrice = memberTypePrice !== undefined ? memberTypePrice.price : product.basePrice;
    // 만약 월요일이라면 1% 추가 할인
    const discountRate =
      this.getKoreaDayOfWeek() === 1
        ? product.discountRate * 10 + MONDAY_DISCOUNT_RATE * 10
        : product.discountRate * 10;

    // 정확한 계산을 위해 10으로 곱했다가 나눠서 계산, 소수점 자리는 버림
    const discountedPrice = Math.floor((basePrice * (100 - discountRate)) / 100);

    return { basePrice, discountedPrice, totalDiscountRate: discountRate };
  }

  /**
   * 서버 시간에 상관 없이 한국 시간의 요일을 가져오는 함수
   * @returns {number} 0: 일요일, 1: 월요일, ..., 6: 토요일 - getDay()와 동일
   */
  private getKoreaDayOfWeek() {
    const now = new Date();

    const utcHours = now.getUTCHours();
    // 현재의 UTC 시간을 한국 시간으로 변환 (UTC+9)
    const koreaHours = (utcHours + 9) % 24;

    // UTC 날짜 기준으로 요일을 가져오고 필요시 하루를 더한다.
    const koreaDayOffset = utcHours + 9 >= 24 ? 1 : 0;
    return (now.getUTCDay() + koreaDayOffset) % 7;
  }
}
