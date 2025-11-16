import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Request } from 'express';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const parsed = Number(id);
    if (Number.isNaN(parsed)) throw new BadRequestException('Invalid ID');
    return this.productService.findOne(parsed);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const parsed = Number(id);
    if (Number.isNaN(parsed)) throw new BadRequestException('Invalid ID');
    return this.productService.update(parsed, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const parsed = Number(id);
    if (Number.isNaN(parsed)) throw new BadRequestException('Invalid ID');
    return this.productService.remove(parsed);
  }

  // ------------------------------------------
  // SUBIR IMAGEN AL PRODUCTO
  // ------------------------------------------
  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const unique = uuidv4();
          cb(null, unique + extname(file.originalname));
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new HttpException('Only images allowed', HttpStatus.BAD_REQUEST), false);
      },
    }),
  )
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: any,    // ← NO FALLA NUNCA
    @Req() req: Request,
  ) {
    const parsed = Number(id);
    if (Number.isNaN(parsed)) throw new BadRequestException('Invalid ID');

    if (!file) throw new BadRequestException('No image uploaded');

    const host = req.get('host');
    const url = `${req.protocol}://${host}/uploads/${file.filename}`;

    const updated = await this.productService.updateImageUrl(parsed, url);

    return {
      message: 'Image uploaded successfully',
      product: updated,
    };
  }
}
