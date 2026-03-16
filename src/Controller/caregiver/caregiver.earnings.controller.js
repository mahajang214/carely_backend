const TransactionModal = require("../../Modals/transaction.modal.js");

const getCaregiverEarnings = async (req, res) => {
  try {
    const caregiverId = req.client.id || req.client._id;

    if (!caregiverId) {
      return res.status(400).json({
        success: false,
        message: "Caregiver ID not found",
      });
    }

    // Fetch confirmed transactions only
    const transactions = await TransactionModal
      .find({
        caregiverId: caregiverId,
        paymentStatus: "confirmed",
      })
      .select("caregiverEarning platformCommission")
      .lean().sort({ createdAt: -1 })

    // Calculate totals
    const totalEarning = transactions.reduce(
      (sum, tx) => sum + (tx.caregiverEarning || 0),
      0
    );

    const totalCommission = transactions.reduce(
      (sum, tx) => sum + (tx.platformCommission || 0),
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        totalEarning,
        totalCommission,
        totalTransactions: transactions.length,
      },
    });

  } catch (error) {
    console.error("EARNINGS ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch earnings",
    });
  }
};

module.exports = {
  getCaregiverEarnings,
};