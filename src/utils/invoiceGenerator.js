const PDFDocument = require("pdfkit");
const fs = require("fs");

const generateInvoice = async (transaction) => {

    const doc = new PDFDocument();

    const filePath = `./invoices/${transaction.invoiceNumber}.pdf`;

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("Invoice", { align: "center" });

    doc.moveDown();

    doc.text(`Invoice Number: ${transaction.invoiceNumber}`);
    doc.text(`Total Amount: ₹${transaction.totalAmount}`);
    doc.text(`Platform Fee: ₹${transaction.platformCommission}`);
    doc.text(`Caregiver Earning: ₹${transaction.caregiverEarning}`);
    doc.text(`Payment Method: ${transaction.paymentMethod}`);
    doc.text(`Payment Status: ${transaction.paymentStatus}`);
    doc.text(`Patient Name : ${transaction.patientName}`);
    doc.text(`Caregiver Name : ${transaction.caregiverName}`);
    doc.text(`Service Name : ${transaction.serviceName}`);
    doc.text(`Service Duration : ${transaction.serviceDuration} hours`);
    doc.text(`Payment Date : ${transaction.paidAt.toDateString()}`);


    doc.end();

    return filePath;
};

module.exports = { generateInvoice };
