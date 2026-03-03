const CaregiverModal = require("../../Modals/caregiver.modal");
const BookingModal = require("../../Modals/bookings.modal");
const UserModal = require("../../Modals/user.modal");
const TransactionModal = require("../../Modals/transaction.modal");
const sendResponse = require("../../utils/apiResponse");

/**
 * Get monthly revenue for the current year
 */
const getMonthlyRevenue = async (req, res) => {
    try {
        const revenueData = await BookingModal.aggregate([
            {
                $match: {
                    serviceStatus: "completed",
                    createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    totalRevenue: { $sum: "$grandTotal" } // Using grandTotal instead of totalPrice
                }
            },
            { $sort: { "_id.month": 1 } }
        ]);

        return sendResponse(res, 200, "Monthly revenue retrieved successfully", revenueData);
    } catch (error) {
        console.error("getMonthlyRevenue error:", error);
        return sendResponse(res, 500, "Failed to retrieve monthly revenue", null);
    }
};

/**
 * Get total platform revenue from transactions
 */
const getPlatformRevenue = async (req, res) => {
    try {
        const summary = await TransactionModal.aggregate([
            { $match: { paymentStatus: "confirmed" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$platformCommission" },
                    totalTransactions: { $sum: 1 },
                    grossAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        return sendResponse(res, 200, "Platform revenue retrieved successfully", summary[0] || {
            totalRevenue: 0,
            totalTransactions: 0,
            grossAmount: 0
        });
    } catch (error) {
        console.error("getPlatformRevenue error:", error);
        return sendResponse(res, 500, "Failed to fetch platform revenue", null);
    }
};

/**
 * Get top 5 most active cities by user count
 */
const getMostActiveCities = async (req, res) => {
    try {
        const cities = await UserModal.aggregate([
            { $group: { _id: "$address.city", userCount: { $sum: 1 } } },
            { $sort: { userCount: -1 } },
            { $limit: 5 }
        ]);

        return sendResponse(res, 200, "Most active cities retrieved successfully", cities);
    } catch (error) {
        console.error("getMostActiveCities error:", error);
        return sendResponse(res, 500, "Failed to retrieve most active cities", null);
    }
};

/**
 * Get caregivers with their linked user location
 */
const getCityOverview = async (req, res) => {
    try {
        const [cityData, caregiverData] = await Promise.all([
            UserModal.aggregate([
                {
                    $group: {
                        _id: "$address.city",
                        userCount: { $sum: 1 }
                    }
                },
                { $sort: { userCount: -1 } }
            ]),
            CaregiverModal.aggregate([
                {
                    $group: {
                        _id: "$address.city",
                        caregiverCount: { $sum: 1 }
                    }
                },
                { $sort: { caregiverCount: -1 } }
            ])
        ]);
        // Merge user and caregiver counts per city
        const mergedData = {};

        cityData.forEach(u => {
            mergedData[u._id] = { city: u._id, userCount: u.userCount, caregiverCount: 0 };
        });

        caregiverData.forEach(c => {
            if (mergedData[c._id]) {
                mergedData[c._id].caregiverCount = c.caregiverCount;
            } else {
                mergedData[c._id] = { city: c._id, userCount: 0, caregiverCount: c.caregiverCount };
            }
        });

        const result = Object.values(mergedData).sort((a, b) => (b.userCount + b.caregiverCount) - (a.userCount + a.caregiverCount));

        return sendResponse(res, 200, "City overview retrieved successfully", result);
    } catch (error) {
        console.error("getCityOverview error:", error);
        return sendResponse(res, 500, "Failed to retrieve city overview", null);
    }
};

const combineAPI = async (req, res) => {
    try {
        const currentYearStart = new Date(new Date().getFullYear(), 0, 1);

        const [
            monthlyRevenue,
            platformRevenue,
            mostActiveCities,
            cityOverview
        ] = await Promise.all([

            BookingModal.aggregate([
                {
                    $match: {
                        serviceStatus: "completed",
                        createdAt: { $gte: currentYearStart }
                    }
                },
                {
                    $group: {
                        _id: { month: { $month: "$createdAt" } },
                        totalRevenue: { $sum: "$grandTotal" }
                    }
                },
                { $sort: { "_id.month": 1 } }
            ]),

            TransactionModal.aggregate([
                { $match: { paymentStatus: "confirmed" } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$platformCommission" },
                        totalTransactions: { $sum: 1 },
                        grossAmount: { $sum: "$totalAmount" }
                    }
                }
            ]),

            UserModal.aggregate([
                { $group: { _id: "$address.city", userCount: { $sum: 1 } } },
                { $sort: { userCount: -1 } },
                { $limit: 5 }
            ]),

            CaregiverModal.aggregate([
                { $group: { _id: "$address.city", caregiverCount: { $sum: 1 } } },
                { $sort: { caregiverCount: -1 } }
            ])

        ]);

        return sendResponse(res, 200, "Dashboard data fetched successfully", {
            monthlyRevenue,
            platformRevenue: platformRevenue[0] || {
                totalRevenue: 0,
                totalTransactions: 0,
                grossAmount: 0
            },
            mostActiveCities,
            cityOverview
        });

    } catch (error) {
        console.error("combineAPI error:", error);
        return sendResponse(res, 500, "Failed to fetch dashboard data", null);
    }
};

module.exports = {
    getMonthlyRevenue,
    getPlatformRevenue,
    getMostActiveCities,
    getCityOverview,
    combineAPI
};