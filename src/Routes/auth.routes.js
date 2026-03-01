require("dotenv").config();
const express = require('express');
const router = express.Router();
const { login, createNewPatient, checkOTP, searchUserForPatient, sendOTP, deleteDocuments, register, patientLogin, forgotPassword, checkUsername, logout } = require("../Controller/auth/auth.controller");



// google auth for user, caregiver, admin, family member
router.post('/google', login);
router.post("/register", register)
// protected route
// patient login by username and password
router.post('/patient-login', patientLogin);
// user
// patient register by users permission 
// search responsible for patient and send request to responsible for patient to confirm or reject by sending OTP 
router.get("/search/:id", searchUserForPatient);
router.post("/send/otp", sendOTP);
router.post("/check/otp/:id", checkOTP);
// send responsible relationship to user to confirm or reject
// router.post('/send/request/:id', sendRequestToResponsibleForPatient);
router.post('/register/patient', createNewPatient)

// delete docs
router.post("/delete-documents", deleteDocuments)

// forgot password
router.post("/forgot-password", forgotPassword)
// check username
router.get("/check-username/:username", checkUsername);

router.post("/logout", logout)




module.exports = router;
