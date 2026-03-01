const TransactionModal = require("../../Modals/transaction.modal");
const sendResponse = require("../../utils/apiResponse");


const getTransactions = async (res, req) => {
    try {
        const transactions = await TransactionModal.find();
        if (!transactions) {
            return sendResponse(res, 204, "No Content", null)
        }
        return sendResponse(res, 200, "Successful", transactions)

    } catch (error) {
        console.log("Error : ", error.message);
        return sendResponse(res, 500, "Error", null)
    }
}
const getTransactionById = async (req, res) => {
    try {
        const transaction = await TransactionModal.findById(req.params.id)
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
        return res.status(500).json({
            success: false,
            message: "Error fetching transaction",
        });
    }
};

module.exports = {
    getTransactionById, getTransactions
}
