const UserModal = require("../../Modals/user.modal");
const sendResponse = require("../../utils/apiResponse");


const getMyLinkedPatients = async (req, res) => {
    try {
        const userId = req.client._id || req.client.id

        const linkedPatients = await UserModal.findById(userId).select("linkedPatients");
        if (linkedPatients.length === 0) {
            return sendResponse(res, 204, "No Patient Linked Yet.", null)
        }
        return sendResponse(res, 200, "No Patient Linked Yet.", linkedPatients)

    } catch (error) {
        return sendResponse(res, 400, "Error", null)

    }
}

const deletePatient = async (req, res) => {
    try {
        const userId = req.client.id || req.client._id;
        const patientId = req.params.id;

        if (!patientId) {
            return sendResponse(res, 400, "Patient ID required", null);
        }

        await UserModal.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    linkedPatients: { patientId: patientId }
                }
            },
            { new: true }
        );

        return sendResponse(res, 200, "Patient removed from linkedPatients");

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error");
    }
};
module.exports={getMyLinkedPatients,deletePatient}