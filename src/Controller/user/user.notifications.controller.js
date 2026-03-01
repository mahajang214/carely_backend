const dotEnv = require("dotenv")
dotEnv.config();
const NotificationModal = require("../../Modals/notification.modal")
const sendResponse = require("../../utils/apiResponse");
const ServicesModal = require("../../Modals/services.modal");
const CaregiverModal = require("../../Modals/caregiver.modal");
const UserModal = require("../../Modals/user.modal");
const BookingModal = require("../../Modals/bookings.modal");






const broadcastRequestToCaregivers = async ({
    serviceId,
    bookingId,
    userId,
    radius = 30
}) => {
    try {



        if (!bookingId) {
            return sendResponse(res, 404, "Invalid", null);

        }
        const service = await ServicesModal.findById(serviceId);
        const user = await UserModal.findById(userId);

        if (!service || !service.isActive) {
            return sendResponse(res, 404, "Invalid or inactive service", null);
        }

        if (!user?.address?.coordinates) {
            return sendResponse(res, 400, "User location not found", null);
        }

        const requiredQualifications = service.requiredQualification;

        const caregivers = await CaregiverModal.find({
            readyForService: true,
            verified: true,
            blocked: false,
            qualifications: { $in: requiredQualifications },

            "address.coordinates": {
                $near: {
                    $geometry: user.address.coordinates,
                    $maxDistance: radius * 1000
                }
            }
        });



        if (!caregivers.length) {
            return sendResponse(res, 404, "No eligible caregivers found", null);
        }




        const notifications = caregivers.map((caregiver) => ({
            recipientId: caregiver._id,
            recipientModel: "CaregiverModal",
            senderId: user._id,
            senderModel: "UserModal",
            title: "Service Request",
            message: `You have a new request for ${service.name}`,
            type: "service",
            referenceId: service._id,
            referenceModel: "ServicesModal",
            priority: "high",
            bookingId: bookingId

        }));

        await NotificationModal.insertMany(notifications);

        return caregivers.length;

    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    broadcastRequestToCaregivers
}