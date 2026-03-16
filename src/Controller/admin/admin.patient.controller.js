const PatientModal = require("../../Modals/patient.modal");
const sendResponse = require("../../utils/apiResponse");

const getAllPatients = async (req, res) => {
    try {
        const patients = await PatientModal.find().select("firstName lastName _id").sort({ createdAt: -1 })
        return sendResponse(res, 200, "Patients retrieved successfully", patients);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve patients", null);
    }
}   //***

const getPatientDetails = async (req, res) => {
    try {
        const patientId = req.params.id
        const patient = await PatientModal.findById(patientId).select("-emergencyContact.responsibleUserId")
        return sendResponse(res, 200, "Patients retrieved successfully", patient);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve patients", null);
    }
}   //***

const blockPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        if (!patientId) {
            return sendResponse(res, 404, "PaitenID not found", null);
        }

        const patient = await PatientModal.findByIdAndUpdate({ _id: patientId }, { blocked: true },   { returnDocument: "after" })

        return sendResponse(res, 200, "Patient blocked successfully", null);
    } catch (error) {
        console.log("ERROR : ", error.message)
        return sendResponse(res, 500, "Failed to block patient", null);
    }
}

const unblockPatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        const patient = await PatientModal.findByIdAndUpdate({ _id: patientId }, { blocked: false },   { returnDocument: "after" })


        return sendResponse(res, 200, "Patient unblocked successfully", null);
    } catch (error) {
        return sendResponse(res, 500, "Failed to unblock patient", null);
    }
}

const getAllBlockedPatients = async (req, res) => {
    try {
        const blockedPatients = await PatientModal.find({ blocked: true });
        return sendResponse(res, 200, "Blocked patients retrieved successfully", blockedPatients);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve blocked patients", null);
    }
}

module.exports = {
    getAllPatients,
    blockPatient,
    unblockPatient,
    getAllBlockedPatients,
    getPatientDetails
}
