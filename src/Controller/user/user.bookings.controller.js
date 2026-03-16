const BookingModal = require("../../Modals/bookings.modal");
const CaregiverModal = require("../../Modals/caregiver.modal");
const PatientModal = require("../../Modals/patient.modal");
const UserModal = require("../../Modals/user.modal");
const ServicesModal = require("../../Modals/services.modal"); // ✅ Missing import
const sendResponse = require("../../utils/apiResponse");
const sendNotification = require("../../utils/sendNotification");
const { broadcastRequestToCaregivers } = require("./user.notifications.controller");


// ==========================
// BOOK SERVICE
// ==========================
const bookServiceInBookings = async (req, res) => {
    try {
        const {
            categoryName,
            patientId,
            duration = {},
            serviceId,
            paymentMethod = "upi",
            schedule = {}
        } = req.body;

        const { startDate, endDate, timeSlot } = schedule;

        const {
            hours,
            price,
        } = duration;

        const userId = req.client._id || req.client.id;

        // ================= USER CHECK =================
        const user = await UserModal.findById(userId).select("firstName lastName");
        if (!user) {
            return sendResponse(res, 404, "User not found", null);
        }

        // ================= SERVICE CHECK =================
        const serviceDetails = await ServicesModal.findById(serviceId);
        if (!serviceDetails) {
            return sendResponse(res, 404, "Service not found", null);
        }

        if (!startDate) {
            return sendResponse(res, 400, "Start date is required", null);
        }

        const parsedHours = Number(duration?.hours);
        if (!parsedHours || isNaN(parsedHours)) {
            return sendResponse(res, 400, "Invalid duration", null);
        }

        // ================= GET MATCHING DURATION PRICE =================
        const selectedDuration = serviceDetails.durationOptions.find(
            (opt) => opt.hours === parsedHours
        );

        if (!selectedDuration) {
            return sendResponse(res, 400, "Invalid duration selected", null);
        }

        const pricePerDay = selectedDuration.price;

        // ================= CALCULATE TOTAL DAYS =================
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date(startDate);

        const diffTime = end.getTime() - start.getTime();
        const totalDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1, 1);

        // ================= PRICING CALCULATION =================
        const basePrice = serviceDetails.basePrice;

        const platformFee = 0; // you can change later
        const tax = Math.round(pricePerDay * 0.00); // 5% example tax
        const discount = 0;

        const finalPerDay = pricePerDay + platformFee + tax - discount;

        const totalPrice = finalPerDay * totalDays;

        // ================= CREATE BOOKING =================
        const booking = await BookingModal.create({
            serviceId,
            userId,
            patientId: patientId || null,
            bookingStatus: "pending",

            schedule: {
                startDate: start,
                endDate: endDate ? end : null,
                timeSlot: timeSlot || null
            },

            duration: {
                hours: parsedHours,
                pricePerDay
            },

            totalDays,

            pricing: {
                basePrice,
                platformFee,
                tax,
                discount,
                finalPerDay
            },

            bookingServiceCategory: categoryName,

            paymentMethod,
            paymentStatus: "pending",
            grandTotal: totalPrice
        });

        // ================= BROADCAST =================
        await broadcastRequestToCaregivers({
            serviceId,
            bookingId: booking._id,
            userId,
            radius: 30
        });

        return sendResponse(res, 200, "Booking Request Sent Successfully", {
            booking,
            totalPrice
        });

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error", null);
    }
};




// ==========================
// GET MY BOOKED SERVICES
// ==========================
const getMyAcceptedBookedServices = async (req, res) => {
    try {
        const userId = req.client._id || req.client.id;

        const bookings = await BookingModal.find({ userId, bookingStatus: "accepted" })
            .populate({
                path: "caregiverId",
                select: "firstName lastName qualifications ratingAverage profilePicture +mobileNumber"
            })
            .sort({ createdAt: -1 });
        if (!bookings) {
            return sendResponse(res, 404, "Not Found", null)
        }

        return sendResponse(res, 200, "Bookings fetched successfully", bookings);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error", null);
    }
};

const getMyPendingBookedServices = async (req, res) => {
    try {
        const userId = req.client._id || req.client.id;

        const bookings = await BookingModal.find({ userId, bookingStatus: "pending" })
            .sort({ createdAt: -1 });
        if (!bookings) {
            return sendResponse(res, 404, "Not Found", null)
        }

        return sendResponse(res, 200, "Bookings fetched successfully", bookings);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error", null);
    }
};

const getMyCompletedBookedServices = async (req, res) => {
    try {
        const userId = req.client._id || req.client.id;

        const bookings = await BookingModal.find({ userId, bookingStatus: "completed" })
            .populate({
                path: "caregiverId",
                select: "firstName lastName qualifications ratingAverage profilePicture +mobileNumber"
            })
            .sort({ createdAt: -1 });
        if (!bookings) {
            return sendResponse(res, 404, "Not Found", null)
        }

        return sendResponse(res, 200, "Bookings fetched successfully", bookings);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error", null);
    }
};

const getMyCancelledBookedServices = async (req, res) => {
    try {
        const userId = req.client._id || req.client.id;

        const bookings = await BookingModal.find({ userId, bookingStatus: "cancelled" })
            .sort({ createdAt: -1 });
        if (!bookings) {
            return sendResponse(res, 404, "Not Found", null)
        }

        return sendResponse(res, 200, "Bookings fetched successfully", bookings);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error", null);
    }
};

const getMyInProgressBookedServices = async (req, res) => {
    try {
        const userId = req.client._id || req.client.id;

        const bookings = await BookingModal.find({ userId, bookingStatus: "in-progress" })
            .populate({
                path: "caregiverId",
                select: "firstName lastName qualifications ratingAverage profilePicture +mobileNumber"
            })
            .sort({ createdAt: -1 });
        if (!bookings) {
            return sendResponse(res, 404, "Not Found", null)
        }

        return sendResponse(res, 200, "Bookings fetched successfully", bookings);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error", null);
    }
};


// ==========================
// GET MY ALL BOOKINGS (ONLY USER)
// ==========================
const getMyBookings = async (req, res) => {
    try {
        const userId = req.client._id || req.client.id;

        const myBookings = await BookingModal.find({ userId });

        return sendResponse(res, 200, "Bookings fetched successfully", myBookings);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error", null);
    }
};



// ==========================
// CANCEL BOOKING
// ==========================
const cancelBooking = async (req, res) => {
    try {
        const { id: bookingId } = req.params;  // ✅ fixed destructuring

        if (!bookingId) {
            return sendResponse(res, 400, "Booking ID is required", null);
        }

        const booking = await BookingModal.findByIdAndUpdate(bookingId, { bookingStatus: "cancelled" }, { returnDocument: "after" });

        if (!booking) {
            return sendResponse(res, 404, "Booking not found", null);
        }


        return sendResponse(res, 200, "Booking cancelled successfully", booking);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error", null);
    }
};


module.exports = {
    bookServiceInBookings,
    getMyBookings,
    cancelBooking,
    getMyAcceptedBookedServices,
    getMyPendingBookedServices, getMyCompletedBookedServices, getMyCancelledBookedServices, getMyInProgressBookedServices
};