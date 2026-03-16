const CaregiverModal = require("../../Modals/caregiver.modal");
const sendResponse = require("../../utils/apiResponse");

const getAllCaregivers = async (req, res) => {
    try {
        const caregivers = await CaregiverModal.find().select("+verificationDocuments +mobileNumber").sort({ createdAt: -1 })
        return sendResponse(res, 200, "Caregivers retrieved successfully", caregivers);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve caregivers", null);
    }
}   //*** 

const blockCaregiver = async (req, res) => {
    try {
        const { caregiverId } = req.params;
        // console.log("Caregiver ID: ", caregiverId)
        if (!caregiverId) {
            return sendResponse(res, 400, "caregiverId is required", null);
        }

        const caregiver = await CaregiverModal.findByIdAndUpdate({ _id: caregiverId }, { blocked: true }, { returnDocument: "after" });



        return sendResponse(res, 200, "Caregiver blocked successfully", null);
    } catch (error) {
        console.log("Error : ", error.message)
        return sendResponse(res, 500, "Failed to block caregiver", null);
    }
}

const unblockCaregiver = async (req, res) => {
    try {
        const { caregiverId } = req.params;

        const caregiver = await CaregiverModal.findByIdAndUpdate({ _id: caregiverId }, { blocked: false },   { returnDocument: "after" })

        return sendResponse(res, 200, "Caregiver unblocked successfully", null);
    } catch (error) {
        return sendResponse(res, 500, "Failed to unblock caregiver", null);
    }
};

const getAllBlockedCaregivers = async (req, res) => {
    try {
        const blockedCaregivers = await CaregiverModal.find({ blocked: true }).select("+verificationDocuments +mobileNumber")
        return sendResponse(res, 200, "Blocked caregivers retrieved successfully", blockedCaregivers);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve blocked caregivers", null);
    }
}   //***


const getAllVerifiedCaregivers = async (req, res) => {
    try {
        const verifiedCaregivers = await CaregiverModal.find({ verified: true }).select("+verificationDocuments +mobileNumber")
        return sendResponse(res, 200, "Verified caregivers retrieved successfully", verifiedCaregivers);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve verified caregivers", null);
    }
} //*** 

const getAllUnverifiedCaregivers = async (req, res) => {
    try {
        const unverifiedCaregivers = await CaregiverModal.find({ verified: false }).select("+verificationDocuments +mobileNumber")
        return sendResponse(res, 200, "Unverified caregivers retrieved successfully", unverifiedCaregivers);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve unverified caregivers", null);
    }
} //***


const verifyCaregiver = async (req, res) => {
    try {
        const { caregiverId } = req.params;

        const caregiver = await CaregiverModal.findByIdAndUpdate({ _id: caregiverId }, { verified: true },   { returnDocument: "after" });


        return sendResponse(res, 200, "Caregiver verified successfully", null);
    } catch (error) {
        return sendResponse(res, 500, "Failed to verify caregiver", null);
    }
} //***

const rejectCaregiverVerification = async (req, res) => {
    try {
        const { caregiverId } = req.params;

        const caregiver = await CaregiverModal.findByIdAndUpdate({ _id: caregiverId }, { verified: false },  { returnDocument: "after" });

        return sendResponse(res, 200, "Caregiver verification rejected successfully", null);
    } catch (error) {
        return sendResponse(res, 500, "Failed to reject caregiver verification", null);
    }
} //***



const getTopRatedCaregivers = async (req, res) => {
    try {
        const topRatedCaregivers = await CaregiverModal.find({ verified: true }).sort({ ratingAverage: -1 }).limit(5);
        return sendResponse(res, 200, "Top rated caregivers retrieved successfully", topRatedCaregivers);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve top rated caregivers", null);
    }
} //*** 

const getLowestRatedCaregivers = async (req, res) => {
    try {
        const lowestRatedCaregivers = await CaregiverModal.find({ verified: true }).sort({ ratingAverage: 1 }).limit(5);
        return sendResponse(res, 200, "Lowest rated caregivers retrieved successfully", lowestRatedCaregivers);
    }
    catch (error) {

        return sendResponse(res, 500, "Failed to retrieve lowest rated caregivers", null);
    }
} //*** 


module.exports = {
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


}