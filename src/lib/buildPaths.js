const path = require('path');

const buildPaths = {
   htmlFilePath: path.resolve('./storage/build.html'),
   cssFilePath: path.resolve('./src/invoice.css'),
   pdfFilePath: path.resolve('./storage/build.pdf'),
   joinedPdfFilePath: path.resolve('./storage/build-joined.pdf'),
   barcodeFilePath: path.resolve('./storage/barcode-image.png'),
   qrcodeFilePath: path.resolve('./storage/qrcode-image.png'),
};

module.exports = buildPaths;