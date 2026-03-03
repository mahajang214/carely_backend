const UserModal = require("../../Modals/user.modal");
const sendResponse = require("../../utils/apiResponse");

const getMyProfile = async (req, res) => {
    try {
        const userId = req.client._id || req.client.id;

        const userInfo = await UserModal.findById(userId)
            .select("+mobileNumber")
            .populate({
                path: "linkedPatients.patientId",
                select: "-__v"
            }).lean()

        if (!userInfo) {
            return sendResponse(res, 400, "Something went wrong", null);
        }

        return sendResponse(res, 200, "Success", userInfo);

    } catch (error) {
        return sendResponse(res, 400, "Error", null);
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const {
            profilePicture,
            mobileNumber,
            gender,
            firstName,
            lastName,
            address
        } = req.body;

        const userId = req.client.id || req.client._id;

        // 1️⃣ Check if user exists
        const user = await UserModal.findById(userId);
        if (!user) {
            return sendResponse(res, 404, "User not found");
        }

        // 2️⃣ Build update object dynamically
        const updateFields = {};

        if (profilePicture) updateFields.profilePicture = profilePicture;
        if (mobileNumber) updateFields.mobileNumber = mobileNumber;
        if (gender) updateFields.gender = gender;
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;

        if (address) {
            if (address.fullAddress !== undefined) {
                updateFields["address.fullAddress"] = address.fullAddress;
            }

            if (address.city !== undefined) {
                updateFields["address.city"] = address.city;
            }

            if (address.state !== undefined) {
                updateFields["address.state"] = address.state;
            }

            if (address.pincode !== undefined) {
                updateFields["address.pincode"] = address.pincode;
            }

            if (address.coordinates) {
                if (address.coordinates.lat !== undefined) {
                    updateFields["address.coordinates.lat"] = address.coordinates.lat;
                }

                if (address.coordinates.lng !== undefined) {
                    updateFields["address.coordinates.lng"] = address.coordinates.lng;
                }
            }
        }

        // 3️⃣ Update
        const updatedUser = await UserModal.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select("-password -__v");

        return sendResponse(res, 200, "Profile updated successfully", updatedUser);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error");
    }
};

const deleteMyAccount = async (req, res) => {
    try {
        const userId = req.client.id || req.client._id;
        const deleteAccount = await UserModal.findByIdAndUpdate(userId, { isActive: false }, { new: true })
        return sendResponse(res, 200, "Success", null)
    } catch (error) {
        return sendResponse(res, 400, "Error", null)
    }
}
module.exports = { getMyProfile, updateMyProfile, deleteMyAccount }