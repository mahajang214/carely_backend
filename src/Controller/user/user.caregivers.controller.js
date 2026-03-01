const CaregiverModal = require("../../Modals/caregiver.modal");
const sendResponse = require("../../utils/apiResponse");


const getAllCaregivers = async (req, res) => {
    try {
        const { category, availabilityAndLocation, ratingAverage } = req.body;

        const getCaregivers = await CaregiverModal.find({ availabilityAndLocation, ratingAverage });

        if (!getCaregivers) {
            return sendResponse(res, 204, "No Content", null)
        }

        return sendResponse(res, 200, "Success", getCaregivers)
    } catch (error) {
        return sendResponse(res, 400, "Error", null)
    }
}

module.exports={getAllCaregivers}
