import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Express } from 'express'
import { CreateOfferCommand } from '../application/commands/impl/create-offer.command'
import { UpdateOfferCommand } from '../application/commands/impl/update-offer.command'
import { CreateOfferDto } from '../application/dtos/create-offer.dto'
import { UpdateOfferDto } from '../application/dtos/update-offer.dto'
import { FindAllOffersQuery } from '../application/queries/impl/find-all-offers.query'
import { FindOneOfferQuery } from '../application/queries/impl/find-one-offer.query'
import { UploadsService } from '../../uploads/uploads.service'
import { OfferType } from '../domain/enums/type.enum'
import { Offer } from '../domain/entities/offer'

@Controller('offers')
export class OffersController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.commandBus.execute(new CreateOfferCommand(createOfferDto))
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.commandBus.execute(new UpdateOfferCommand(+id, updateOfferDto));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Offer> {
    return this.queryBus.execute(new FindOneOfferQuery(+id))
  }

  @Get()
  findAll(
    @Query('type') type?: OfferType,
    @Query('email') email?: string,
    @Query('city') city?: string,
  ): Promise<Offer[]> {
    return this.queryBus.execute(new FindAllOffersQuery(type, email, city))
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /image\/(jpeg|png|gif)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const uploadedFileUrl = await this.uploadsService.uploadFile(file)
    return {
      message: 'File uploaded successfully',
      url: uploadedFileUrl,
    }
  }
}
