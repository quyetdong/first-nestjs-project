const fs = require('fs');
import * as puppeteer from 'puppeteer';
const { PDFDocument } = require('pdf-lib');
// Build paths
const { htmlFilePath, pdfFilePath, joinedPdfFilePath } = require('./lib/buildPaths');

const printPdfFromHtml = async () => {
	/** Launch a headleass browser */
	const browser = await puppeteer.launch();

	/* 1- Ccreate a newPage() object. It is created in default browser context. */
	const page = await browser.newPage();
	/* 2- Will open our generated `.html` file in the new Page instance. */
	await page.goto('file:' + htmlFilePath, { waitUntil: 'networkidle0' });
	/* 3- Take a snapshot of the PDF */
	const pdf = await page.pdf({
		format: 'A4',
		margin: {
			top: '5mm',
			right: '8mm',
			bottom: '8mm',
			left: '5mm'
		}
	});
	/* 4- Cleanup: close browser. */
	await browser.close();
	console.log('Ending: Generating PDF Process');

	return pdf;
};


const joinPdfFiles = async () => {
	// Create a new PDFDocument
	const pdfDoc = await PDFDocument.create();

	// These should be Uint8Arrays or ArrayBuffers
	// This data can be obtained in a number of different ways
	// If your running in a Node environment, you could use fs.readFile()
	// In the browser, you could make a fetch() call and use res.arrayBuffer()
	const firstDonorPdfBytes = await printPdfFromHtml();
	const secondDonorPdfBytes = await printPdfFromHtml();

	// Load a PDFDocument from each of the existing PDFs
	const firstDonorPdfDoc = await PDFDocument.load(firstDonorPdfBytes)
	const secondDonorPdfDoc = await PDFDocument.load(secondDonorPdfBytes)

	// Copy the 1st page from the first donor document, and 
	// the 743rd page from the second donor document
	const [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [0])
	const [secondDonorPage] = await pdfDoc.copyPages(secondDonorPdfDoc, [1])

	// Add the first copied page
	pdfDoc.addPage(firstDonorPage)

	// Insert the second copied page to index 0, so it will be the 
	// first page in `pdfDoc`
	pdfDoc.insertPage(0, secondDonorPage)

	// Serialize the PDFDocument to bytes (a Uint8Array)
	const pdfBytes = await pdfDoc.save()

	return pdfBytes;
	// For example, `pdfBytes` can be:
	//   • Written to a file in Node
	//   • Downloaded from the browser
	//   • Rendered in an <iframe>
}

const createPdf = async () => {
	try {
		const originalPdf = await printPdfFromHtml();
		const joinedPdf = await joinPdfFiles();

		fs.writeFileSync(pdfFilePath, originalPdf);

		fs.writeFileSync(joinedPdfFilePath, joinedPdf);
		console.log('Succesfully created an PDF table');
	} catch (error) {
		console.log('Error generating PDF', error);
	}
};

export { createPdf, printPdfFromHtml, joinPdfFiles };