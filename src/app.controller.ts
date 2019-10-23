import { createReadStream } from 'fs';
import { Controller, Get, HttpCode, Header, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
const { joinedPdfFilePath } = require('./lib/buildPaths');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('pdf')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=invoice-test.pdf')
  async pdf(@Res() res: Response) {
    res.set({
      'Content-Type': 'application/pdf',
    });
    this.appService.createHtml();
    const pdfStream = this.appService.createPdf();

    console.log('joined', joinedPdfFilePath);

    pdfStream.pipe(res);
  }
}
