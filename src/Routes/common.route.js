const { getBookingDetails } = require("../Controller/common/booking.controller");
const { getAllCareNotes, getCareNote, addCareNote } = require("../Controller/common/careNotes.controller");
const { getAllCategories } = require("../Controller/common/category.controller");
const { getMyNotifications, markNotificationAsRead, getMyUnreadNotifications, deleteNotification, getDetailedNotification } = require("../Controller/common/notification.controller");
const { getAllServices, getServices, getServiceInfo } = require("../Controller/common/services.controller");
const verifyclient = require("../Middlewares/verifyclient.middleware")

const router = require("express").Router()

//CATEGORIES
router.get("/categories/all", verifyclient, getAllCategories)


// SERVICES
router.get("/services/all", verifyclient, getServices);
router.get("/services/:id", verifyclient, getServiceInfo)

// NOTIFICATION
router.get("/notifications", verifyclient, getMyNotifications);
router.patch("/notifications/:id/read", verifyclient, markNotificationAsRead);
router.get("/notifications/unread", verifyclient, getMyUnreadNotifications);
router.get("/notifications/:id", verifyclient, getDetailedNotification)
router.delete("/notifications/:id", verifyclient, deleteNotification);

// BOOKING
router.get("/booking/:id", verifyclient, getBookingDetails);

// carenotes
router.get("/carenotes", verifyclient, getAllCareNotes)
router.get("/carenotes/:id", verifyclient, getCareNote)
router.post("/carenotes/add", verifyclient, addCareNote)


module.exports = router