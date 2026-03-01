const CaregiverModal = require("../../Modals/caregiver.modal");

const getMyProfile = async (req, res) => {
    try {
        const caregiver = await CaregiverModal
            .findById(req.client.id || req.client._id)
            .select("+mobileNumber +verificationDocuments");

        if (!caregiver) {
            return res.status(404).json({
                success: false,
                message: "Caregiver not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: caregiver,
        });
    } catch (error) {
        console.log("ERROR:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const allowedUpdates = [
            "firstName",
            "lastName",
            "profilePicture",
            "qualifications",
            "availabilityAndLocation",
            "address",
            "mobileNumber",
            "readyForService",
            "verificationDocuments",
        ];

        const updates = {};

        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // Validate readyForService as boolean
        if (
            Object.prototype.hasOwnProperty.call(updates, "readyForService") &&
            typeof updates.readyForService !== "boolean"
        ) {
            return res.status(400).json({
                success: false,
                message: "readyForService must be a boolean value",
            });
        }

        const caregiver = await CaregiverModal.findByIdAndUpdate(
            req.client.id,
            { $set: updates },
            {
                returnDocument: "after",  // ✅ correct way
                runValidators: true,
            }
        ).select("+mobileNumber +verificationDocuments");

        if (!caregiver) {
            return res.status(404).json({
                success: false,
                message: "Caregiver not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: caregiver,
        });
    } catch (error) {
        console.log("ERROR:", error.message);
        return res.status(500).json({
            success: false,
            message: "Update failed",
        });
    }
};

const updateAvailability = async (req, res) => {
    try {
        const { availabilityAndLocation } = req.body;

        const caregiver = await CaregiverModal.findByIdAndUpdate(
            req.client.id,
            { $set: { availabilityAndLocation } },
            {
                returnDocument: "after",   // ✅ only this
                runValidators: true,
            }
        );

        if (!caregiver) {
            return res.status(404).json({
                success: false,
                message: "Caregiver not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Availability updated",
            data: caregiver,
        });
    } catch (error) {
        console.log("ERROR:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to update availability",
        });
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    updateAvailability,
};