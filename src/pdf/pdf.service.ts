import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { ItemsService } from '../items/item.service';

@Injectable()
export class PdfService {
  constructor(private readonly itemsService: ItemsService) {}

  async generateItemsPdf(): Promise<Buffer> {
    const items = await this.itemsService.findAll();

    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));

    doc
      .fillColor('#333333')
      .fontSize(24)
      .text('Lista de productos', { align: 'center' });
    doc.moveDown(1.5);

    items.forEach((item) => {
      doc.fillColor('#000000').fontSize(14);
      doc.text(`ID: ${item.id}`);
      doc.fillColor('#0056b3').text(`Título: ${item.title}`);

      doc.fillColor('#000000');
      if (item.description) {
        doc.text(`Descripción: ${item.description}`);
      }
      doc.text(`Precio: \$${item.price}`);
      doc.text(
        `Vendedor: ${item.seller.username}    Email: ${item.seller.email}`,
      );

      doc.moveDown();

      const currentY = doc.y;
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(doc.page.margins.left, currentY)
        .lineTo(doc.page.width - doc.page.margins.right, currentY)
        .stroke();

      doc.moveDown();
    });

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', (err) => {
        reject(err);
      });
    });
  }
}
