const ComplaintModal = require("../../Modals/complaints.modal");
const sendResponse = require("../../utils/apiResponse");

const getAllComplaints = async (req, res) => {
    try {
        const complaints = await ComplaintModal.find().populate('complainantId accusedId');
        return sendResponse(res, 200, true, null, "Complaints retrieved successfully", complaints);
    } catch (error) {
        return sendResponse(res, 500, false, null, "Failed to retrieve complaints", null);
    }
}   //*** 

const getPendingComplaints = async (req, res) => {
    try {
        const pendingComplaints = await ComplaintModal.find({ status: 'pending' }).populate('complainantId accusedId');
        return sendResponse(res, 200, "Pending complaints retrieved successfully", null, pendingComplaints);
    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve pending complaints", null);
    }
}   //***

const getResolvedComplaints = async (req, res) => {
    try {
        const resolvedComplaints = await ComplaintModal.find({ status: 'resolved' }).populate('complainantId accusedId');
        return sendResponse(res, 200, true, null, "Resolved complaints retrieved successfully", resolvedComplaints);
    } catch (error) {
        return sendResponse(res, 500, false, null, "Failed to retrieve resolved complaints", null);
    }
}   //***

const getRejectedComplaints = async (req, res) => {
    try {
        const rejectedComplaints = await ComplaintModal.find({ status: 'rejected' }).populate('complainantId accusedId');
        return sendResponse(res, 200, true, null, "Rejected complaints retrieved successfully", rejectedComplaints);
    } catch (error) {
        return sendResponse(res, 500, false, null, "Failed to retrieve rejected complaints", null);
    }
}   //***

const resolveComplaint = async (req, res) => {
    try {
        const { complaintId } = req.params;

        const complaint = await ComplaintModal.findById(complaintId);
        if (!complaint) {
            return sendResponse(res, 404, false, null, "Complaint not found", null);
        }

        complaint.status = 'resolved';
        await complaint.save();

        return sendResponse(res, 200, true, null, "Complaint resolved successfully", null);
    } catch (error) {
        return sendResponse(res, 500, false, null, "Failed to resolve complaint", null);
    }
}   //***

const rejectComplaint = async (req, res) => {
    try {
        const { complaintId } = req.params;

        const complaint = await ComplaintModal.findById(complaintId);
        if (!complaint) {
            return sendResponse(res, 404, false, null, "Complaint not found", null);
        }

        complaint.status = 'rejected';
        await complaint.save();

        return sendResponse(res, 200, true, null, "Complaint rejected successfully", null);
    } catch (error) {
        return sendResponse(res, 500, false, null, "Failed to reject complaint", null);
    }
}   //***

module.exports = {
    getAllComplaints,
    getPendingComplaints,
    getResolvedComplaints,
    getRejectedComplaints,
    resolveComplaint,
    rejectComplaint
}