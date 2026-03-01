const ComplaintModal = require("../../Modals/complaints.modal");
const sendResponse = require("../../utils/apiResponse");

const fileComplaintByUser = async (req, res) => {
    try {
        const { caregiverId, bookingId, complaint } = req.body;
        const userId = req.client.id || req.client._id;

        if (!complaint) {
            return sendResponse(res, 400, "Complaint text is required");
        }

        //  Only one target allowed
        const targets = [caregiverId, bookingId].filter(Boolean);

        if (targets.length !== 1) {
            return sendResponse(res, 400, "Provide exactly one target (caregiver or booking)");
        }

        let to, toModel;

        if (caregiverId) {
            to = caregiverId;
            toModel = "CaregiverModal";
        }

        if (bookingId) {
            to = bookingId;
            toModel = "BookingModal"; //  Add this to enum if needed
        }

        const createComplaint = await ComplaintModal.create({
            from: userId,
            fromModel: "UserModal",
            to,
            toModel,
            complaint,
            status: "pending"
        });

        return sendResponse(res, 200, "Complaint filed successfully", createComplaint);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error");
    }
};

const getMyComplaints = async (req, res) => {
    try {
        const userId = req.client.id || req.client._id;

        const complaints = await ComplaintModal.find({
            from: userId
        })
            .populate("to") // auto resolves using refPath
            .sort({ createdAt: -1 });

        return sendResponse(res, 200, "Success", complaints);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error");
    }
};
module.exports={fileComplaintByUser,getMyComplaints}