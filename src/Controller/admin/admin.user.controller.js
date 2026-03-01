const UserModal = require("../../Modals/user.modal");
const sendResponse = require("../../utils/apiResponse");

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModal.find().select("+mobileNumber")
        return sendResponse(res, 200, "Users retrieved successfully", users);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve users", null);
    }
} //*** 


const blockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await UserModal.findByIdAndUpdate({ _id: userId }, { blocked: true }, { new: true });


        return sendResponse(res, 200, "User blocked successfully", null);
    } catch (error) {
        return sendResponse(res, 500, "Failed to block user", null);
    }
};  //***

const unblockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await UserModal.findByIdAndUpdate({ _id: userId }, { blocked: false }, { new: true });

        return sendResponse(res, 200, "User unblocked successfully", null);
    } catch (error) {
        return sendResponse(res, 500, "Failed to unblock user", null);
    }
};  //***
const getAllBlockedUsers = async (req, res) => {
    try {
        const blockedUsers = await UserModal.find({ blocked: true });
        return sendResponse(res, 200, "Blocked users retrieved successfully", blockedUsers);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve blocked users", null);
    }
}
const userBookingHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        const bookings = await BookingModal.find({ userId }).populate('patientId caregiverId serviceId');
        return sendResponse(res, 200, "User booking history retrieved successfully", bookings);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve user booking history", null);
    }
} //***

module.exports = {
    getAllUsers,
    blockUser,
    unblockUser,
    getAllBlockedUsers,
    userBookingHistory
}