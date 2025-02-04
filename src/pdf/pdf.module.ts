import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { ItemsModule } from '../items/item.module';

@Module({
  imports: [ItemsModule],
  providers: [PdfService],
  controllers: [PdfController],
})
export class PdfModule {}
