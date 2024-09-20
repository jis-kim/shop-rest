import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetProductQueryDto } from './dto/get-product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { MemberContextGuard } from '@/auth/guard/member-context.guard';
import { GetMemberContext } from '@/common/decorator/get-member-context.decorator';
import { MemberContext } from '@/common/types/member-context.type';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(MemberContextGuard)
  @Get()
  async getProducts(
    @Query() query: GetProductQueryDto,
    @GetMemberContext() memberContext: MemberContext,
  ): Promise<ProductResponseDto> {
    return await this.productService.getProducts(query, memberContext);
  }
}
