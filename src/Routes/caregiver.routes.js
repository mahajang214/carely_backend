const express = require("express");
const router = express.Router();
const verifyClient = require("../Middlewares/verifyclient.middleware.js");

// Profile
const { getMyProfile, updateMyProfile, updateAvailability } = require("../Controller/caregiver/caregiver.profile.controller")
// Bookings
const {
    getMyBookings,
    acceptBooking,
    rejectBooking,
    updateBookingStatus, addCareNote,
    cancleBooking
} = require("../Controller/caregiver/caregiver.bookings.controller")
// Earnings
const { getCaregiverEarnings } = require("../Controller/caregiver/caregiver.earnings.controller")



// Add middleware
router.use(verifyClient);


// ===============================
// PROFILE  
// ===============================

router.get("/me", getMyProfile);
router.patch("/me", updateMyProfile);
router.patch("/availability", updateAvailability);

// ===============================
// BOOKINGS  
// ===============================
router.get("/bookings", getMyBookings);
router.patch("/bookings/:bookingId/accept", acceptBooking);
router.patch("/bookings/:bookingId/cancle", cancleBooking);
router.patch("/bookings/:bookingId/status", updateBookingStatus);

// carenotes
router.post("/bookings/:bookingId/care-notes", addCareNote);

// ===============================
// EARNINGS  
// ===============================
router.get("/earnings", getCaregiverEarnings);

module.exports = router;
