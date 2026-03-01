const BookingModal = require("../../Modals/bookings.modal");
const { generateInvoice } = require("../../utils/invoiceGenerator.js")
const TransactionModal = require("../../Modals/transaction.modal.js")


const createTransaction = async (req, res) => {
    try {
        const { bookingId, paymentMethod } = req.body;
        const userId = req.client.id || req.client._id

        const booking = await BookingModal.findById(bookingId)
            .populate("serviceId")
            .populate("patientId")
            .populate("caregiverId");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (!booking.grandTotal) {
            return res.status(400).json({
                success: false,
                message: "Total not found",
            });
        }


        const transaction = await TransactionModal.create({
            bookingId: booking._id,
            userId: userId,
            patientId: booking.patientId,
            caregiverId: booking.caregiverId._id,
            totalAmount: booking.grandTotal,
            paymentMethod,
            paymentStatus: "confirmed",
            paidAt: new Date(),
        });
        booking.paymentStatus = "paid";
        booking.transactionId = transaction._id;
        await booking.save();

        // Generate invoice
        // const invoicePath = await generateInvoice({
        //     ...transaction.toObject(),
        //     patientName:
        //         booking.patientId.firstName + " " + booking.patientId.lastName,
        //     caregiverName:
        //         booking.caregiverId.firstName + " " + booking.caregiverId.lastName,
        //     serviceName: booking.serviceId.serviceName,
        //     serviceDuration: booking.serviceId.duration,
        // });

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction,
            // invoice: invoicePath,
        });
    } catch (error) {
        console.log("CREATE TRANSACTION ERROR : ", error.message)
        return res.status(500).json({
            success: false,
            message: "Transaction failed",
        });
    }
};

const getMyTransactions = async (req, res) => {
    try {
        const userId = req.client._id || req.client.id;

        const transactions = await TransactionModal.find({ userId })
            .select("totalAmount paymentStatus createdAt bookingId")
            .populate({
                path: "bookingId",
                select: "bookingServiceCategory "
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: transactions,
        });

    } catch (error) {
        console.log("ERROR : ", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch transactions",
        });
    }
};

const getTransactionById = async (req, res) => {
    try {
        const transactionId = req.params.id
        const transaction = await TransactionModal.findById(transactionId)
            .populate("bookingId")
            .populate("userId")
            .populate("caregiverId");

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        console.log("ERROR : ", error.message)

        return res.status(500).json({
            success: false,
            message: "Error fetching transaction",
        });
    }
};

module.exports = { createTransaction, getMyTransactions, getTransactionById }