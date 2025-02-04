import { Controller, Get, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  // Only admin and user roles can download the PDF
  @Get('items')
  @Roles('admin', 'user')
  async getItemsPdf(@Res() res: Response) {
    const pdfBuffer = await this.pdfService.generateItemsPdf();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=items.pdf',
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }
}
