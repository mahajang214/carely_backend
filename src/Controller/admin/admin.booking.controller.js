const BookingModal = require('../../Modals/bookings.modal');
const sendResponse = require('../../utils/apiResponse');

const getAllBookings = async (req, res) => {
    try {
        const bookings = await BookingModal.find().select("bookingStatus _id").lean().sort({ createdAt: -1 })

        return sendResponse(res, 200, "Bookings retrieved successfully", bookings);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve bookings", null);
    }
}

const getBookingDetails = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const booking = await BookingModal.findById(bookingId)
            .populate({
                path: "caregiverId",
                select: "firstName lastName email mobileNumber"
            })
            .populate({
                path: "userId",
                select: "firstName lastName email mobileNumber"
            })
            .populate({
                path: "patientId",   //  FIXED HERE
                select: "firstName lastName gender"
            })
            .populate({
                path: "serviceId",
                select: "name categoryName"
            }).select("bookingStatus paymentMethod paymentStatus bookingServiceCategory Schedule Duration.hours totalDays pricing.finalPerDay grandTotal")

        if (!booking) {
            return sendResponse(res, 404, "Booking not found", null);
        }

        return sendResponse(
            res,
            200,
            "Booking retrieved successfully",
            booking
        );
    } catch (error) {
        console.error("Error fetching booking:", error);
        return sendResponse(res, 500, "Failed to retrieve booking", null);
    }
};

const getAllPendingBookings = async (req, res) => {
    try {
        const pendingBookings = await BookingModal.find({ requestStatus: 'pending' }).populate('patientId caregiverId serviceId');
        return sendResponse(res, 200, "Pending bookings retrieved successfully", pendingBookings);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve pending bookings", null);
    }
}   //*** 

const getAllCompletedBookings = async (req, res) => {
    try {
        const completedBookings = await BookingModal.find({ serviceStatus: 'completed' }).populate('patientId caregiverId serviceId');
        return sendResponse(res, 200, "Completed bookings retrieved successfully", completedBookings);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve completed bookings", null);
    }
}   //***

const getAllRejectedBookings = async (req, res) => {
    try {
        const rejectedBookings = await BookingModal.find({ requestStatus: 'rejected' }).populate('patientId caregiverId serviceId');
        return sendResponse(res, 200, "Rejected bookings retrieved successfully", rejectedBookings);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve rejected bookings", null);
    }
}   //***

const caregiverServiceHistory = async (req, res) => {
    try {
        const { caregiverId } = req.params;

        const bookings = await BookingModal.find({ caregiverId }).populate('patientId serviceId');
        return sendResponse(res, 200, "Caregiver service history retrieved successfully", bookings);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve caregiver service history", null);
    }
} //***

module.exports = {
    getAllBookings,
    getAllPendingBookings,
    getAllCompletedBookings,
    getAllRejectedBookings, caregiverServiceHistory,
    getBookingDetails
}