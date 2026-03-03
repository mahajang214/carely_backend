const express = require("express");
const router = express.Router();
const verifyclient = require("../Middlewares/verifyclient.middleware");
// Services
const { filterServices, } = require("../Controller/user/user.services.controller")
// Bookings
const {
    bookServiceInBookings,
    getMyBookedServices,
    getMyBookings,
    cancelBooking,
    getMyAcceptedBookedServices,
    getMyInProgressBookedServices,
    getMyCancelledBookedServices,
    getMyCompletedBookedServices,
    getMyPendingBookedServices,
} = require("../Controller/user/user.bookings.controller");
// Caregivers
const { getAllCaregivers } = require("../Controller/user/user.caregivers.controller");
// Profile
const { getMyProfile, updateMyProfile, deleteMyAccount } = require("../Controller/user/user.profile.controller")
// Patients
const { getMyLinkedPatients, deletePatient } = require("../Controller/user/user.patients.controller")
// Reviews
const { addReview, updateReview,
    deleteReview, getReviewsByCategory, 
    getReviews} = require("../Controller/user/user.review.controller");
// Complaints 
const { fileComplaintByUser, getMyComplaints } = require("../Controller/user/user.complaints.controller")
// Notifications
const {
    broadcastRequestToCaregivers
} = require("../Controller/user/user.notifications.controller")
// Transactions
const { createTransaction, getMyTransactions, getTransactionById } = require("../Controller/user/user.transaction.controller")

// =======================
// Services
// =======================

router.get("/services/filter", verifyclient, filterServices);
router.post("/services/book", verifyclient, bookServiceInBookings);

// =======================
// Bookings
// =======================
router.get("/bookings/all", verifyclient, getMyBookings);

router.get("/bookings/accepted/services", verifyclient, getMyAcceptedBookedServices); // optional
router.get("/bookings/pending/services", verifyclient, getMyPendingBookedServices); // optional
router.get("/bookings/completed/services", verifyclient, getMyCompletedBookedServices); // optional
router.get("/bookings/cancelled/services", verifyclient, getMyCancelledBookedServices); // optional
router.get("/bookings/in-progress/services", verifyclient, getMyInProgressBookedServices); // optional

router.patch("/bookings/:id/cancel", verifyclient, cancelBooking);

// =======================
// Caregivers
// =======================
router.get("/caregivers", verifyclient, getAllCaregivers);

// =======================
// Profile
// =======================
router.get("/profile", verifyclient, getMyProfile);
router.patch("/profile", verifyclient, updateMyProfile);
router.delete("/profile", verifyclient, deleteMyAccount);

// =======================
// Patients
// =======================
router.get("/patients", verifyclient, getMyLinkedPatients);
router.delete("/patients/:id", verifyclient, deletePatient);

// =======================
// Reviews
// =======================
router.post("/reviews", verifyclient, addReview);
router.patch("/reviews/:id", verifyclient, updateReview);
router.delete("/reviews/:id", verifyclient, deleteReview);
router.get("/reviews/filter", verifyclient, getReviews);
// router.get("/reviews/check")


// =======================
// Complaints
// =======================
router.post("/complaints", verifyclient, fileComplaintByUser);
router.get("/complaints/my", verifyclient, getMyComplaints);

// =======================
// Notifications
// =======================
// broadcast request
// router.get("/notifications-request/:id", verifyclient, broadcastRequestToCaregivers) this is called from booking

// =======================
// Transactions
// =======================
router.get("/transaction/my", verifyclient, getMyTransactions);
router.post("/transaction/create", verifyclient, createTransaction);
router.get("/transaction/:id", verifyclient, getTransactionById);

module.exports = router;
