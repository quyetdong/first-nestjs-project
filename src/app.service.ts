import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

import * as fs from 'fs';
import * as data from './data.json';
import * as filePaths from './lib/buildPaths';
import createHtmlFile from './createHtml';
import * as createPdf from './createPdf';

const { createUserInfor } = require('./lib/createuserInfor');
const { createInvoiceInfor } = require('./lib/createInvoiceInfor');
const { createTable } = require('./lib/createTable');
const { createInvoiceSupplementInfor } = require('./lib/createInvoiceSupplementInfor');
const { createBarcodeBlock } = require('./lib/createBarcodeBlock');
const { createFooter } = require('./lib/createFooter');

const { htmlFilePath, cssFilePath } = filePaths;

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  createHtml(): any {
    createHtmlFile();
  }

  createPdf(): Readable {
    const stream = new Readable();
    stream.push(createPdf.printPdfFromHtml());

    return stream;
  }
}
