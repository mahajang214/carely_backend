const BookingModal = require("../../Modals/bookings.modal")
const sendResponse = require("../../utils/apiResponse")


const getBookingDetails = async (req, res) => {
    try {
        const { id: bookingId } = req.params
        if (!bookingId) {
            return sendResponse(res, 404, "NOT FOUND", null)
        }

        const booking = await BookingModal.findById(bookingId);
        if (!booking) {
            return sendResponse(res, 404, "NOT FOUND", null)
        }
        return sendResponse(res, 200, "Successful", booking)

    } catch (error) {
        console.log("Error: ", error.message)
        return sendResponse(res, 500, "Error", null)

    }
}



module.exports = {
    getBookingDetails
}