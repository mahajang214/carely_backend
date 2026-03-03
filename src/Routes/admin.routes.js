const express = require("express");
const router = express.Router();
const verifyClient = require("../Middlewares/verifyclient.middleware.js");
// Services
const {
  getMostBookedServices,
  addService,
  removeService,
  updateService,
  createCategory,
  removeQualification,
} = require("../Controller/admin/admin.services.controller.js")
// Users
const {
  getAllUsers,
  blockUser,
  unblockUser,
  getAllBlockedUsers,
  userBookingHistory
} = require("../Controller/admin/admin.user.controller.js")
// Patients
const {
  getAllPatients,
  blockPatient, getPatientDetails,
  unblockPatient,
  getAllBlockedPatients,
} = require("../Controller/admin/admin.patient.controller.js")
// Complaints
const {
  getAllComplaints,
  getResolvedComplaints,
  getRejectedComplaints,
  resolveComplaint,
  rejectComplaint,
  getPendingComplaints
} = require("../Controller/admin/admin.complaints.controller.js")
// Caregivers
const {
  getAllCaregivers,
  blockCaregiver,
  unblockCaregiver,
  getAllBlockedCaregivers,
  getAllVerifiedCaregivers,
  getAllUnverifiedCaregivers,
  verifyCaregiver,
  rejectCaregiverVerification,
  getTopRatedCaregivers,
  getLowestRatedCaregivers,


} = require("../Controller/admin/admin.caregiver.controller.js")
// Broadcasts
const {
  broadcastUsers,
  broadcastCaregivers,
  broadcast,
} = require("../Controller/admin/admin.broadcast.controller.js");
// Bookings
const {
  getAllBookings,
  getAllPendingBookings,
  getAllCompletedBookings,
  getAllRejectedBookings, caregiverServiceHistory,
  getBookingDetails
} = require("../Controller/admin/admin.booking.controller.js");
// Analytics
const {
  getMonthlyRevenue,
  getPlatformRevenue,
  getMostActiveCities,
  getCityOverview,
  combineAPI
} = require("../Controller/admin/admin.analytics.controller.js")
// Transactions
const {
  getTransactionById, getTransactions
} = require("../Controller/admin/admin.transactions.controller.js")

// ------------------------------------------------------------------------

// ===============================
// SERVICES
// ===============================
router.route("/services")
  .post(verifyClient, addService);

router.route("/services/:serviceId")
  .put(verifyClient, updateService)
  .delete(verifyClient, removeService);

router.post("/services/remove-qualificaion/:serviceId", verifyClient, removeQualification)

router.post("/services/create/category", verifyClient, createCategory)

router.get("/services/analytics/most-booked", verifyClient, getMostBookedServices);


// ===============================
// USERS
// ===============================
router.get("/users", verifyClient, getAllUsers);
router.get("/users/blocked", verifyClient, getAllBlockedUsers);
router.get("/users/:userId/bookings", verifyClient, userBookingHistory);

router.patch("/users/:userId/block", verifyClient, blockUser);
router.patch("/users/:userId/unblock", verifyClient, unblockUser);


// ===============================
// CAREGIVERS
// ===============================
router.get("/caregivers", verifyClient, getAllCaregivers);
router.get("/caregivers/blocked", verifyClient, getAllBlockedCaregivers);
router.get("/caregivers/verified", verifyClient, getAllVerifiedCaregivers);
router.get("/caregivers/unverified", verifyClient, getAllUnverifiedCaregivers);

router.get("/caregivers/:caregiverId/services", verifyClient, caregiverServiceHistory);

router.patch("/caregivers/:caregiverId/block", verifyClient, blockCaregiver);
router.patch("/caregivers/:caregiverId/unblock", verifyClient, unblockCaregiver);

router.patch("/caregivers/:caregiverId/verify", verifyClient, verifyCaregiver);
router.patch("/caregivers/:caregiverId/reject-verification", verifyClient, rejectCaregiverVerification);

router.get("/caregivers/top-rated", verifyClient, getTopRatedCaregivers);
router.get("/caregivers/lowest-rated", verifyClient, getLowestRatedCaregivers);


// ===============================
// PATIENTS
// ===============================
router.get("/patients", verifyClient, getAllPatients);
router.get("/patient/:id", verifyClient, getPatientDetails)
router.get("/patients/blocked", verifyClient, getAllBlockedPatients);
router.patch("/patients/:patientId/block", verifyClient, blockPatient);
router.patch("/patients/:patientId/unblock", verifyClient, unblockPatient);


// ===============================
// BOOKINGS
// ===============================
router.get("/bookings", verifyClient, getAllBookings);
router.get("/bookings/pending", verifyClient, getAllPendingBookings);
router.get("/bookings/completed", verifyClient, getAllCompletedBookings);
router.get("/bookings/rejected", verifyClient, getAllRejectedBookings);
router.get(`/bookings/:id`, verifyClient, getBookingDetails)


// ===============================
// COMPLAINTS
// ===============================
router.get("/complaints", verifyClient, getAllComplaints);
router.get("/complaints/pending", verifyClient, getPendingComplaints);
router.get("/complaints/resolved", verifyClient, getResolvedComplaints);
router.get("/complaints/rejected", verifyClient, getRejectedComplaints);

router.patch("/complaints/:complaintId/resolve", verifyClient, resolveComplaint);
router.patch("/complaints/:complaintId/reject", verifyClient, rejectComplaint);


// ===============================
// ANALYTICS
// ===============================
router.get("/analytics/monthly-revenue", verifyClient, getMonthlyRevenue);
router.get("/analytics/most-active-cities", verifyClient, getMostActiveCities);
router.get("/analytics/location-overview", verifyClient, getCityOverview);
router.get("/analytics/platform-revenue", verifyClient, getPlatformRevenue)
router.get("/analytics/combine-api", verifyClient, combineAPI)


// ===============================
// BROADCAST
// ===============================
router.post("/broadcast/users", verifyClient, broadcastUsers);
router.post("/broadcast/caregivers", verifyClient, broadcastCaregivers);
router.post("/broadcast/all", verifyClient, broadcast);


// ===============================
// TRANSACTIONS
// ===============================

router.get("/transaction/:id", verifyClient, getTransactionById);
router.get("/transactions/all", verifyClient, getTransactions)
module.exports = router;
