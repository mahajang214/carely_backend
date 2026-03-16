const notificationModal = require("../Modals/notification.modal");

const NOTIFICATION_TYPES = {
    BOOKING: "booking",
    COMPLAINT: "complaint",
    PAYMENT: "payment",
    SERVICE: "service",
    SYSTEM: "system",
    EMERGENCY: "emergency",
    RELATIONSHIP_REQUEST: "relationship_request",
    RELATIONSHIP_RESPONSE: "relationship_response",
    GENERAL: "general",
    EVENT_NOTIFICATION: "event_notification",
    PASSWORD_RESET: "password_reset"
};

const sendNotification = async ({
    senderId,
    senderModel,
    recipientId,
    recipientModel,
    message,
    title,
    type,
    priority
}) => {

    try {

        const newNotification = await notificationModal.create({
            senderId,
            senderModel,
            recipientId,
            recipientModel,
            message,
            title,
            type,
            priority: priority || "normal"
        });

        return { success: true };

    } catch (error) {
        console.error("Error sending notification:", error);
        return { success: false, error: error.message };
    }

};

module.exports = sendNotification;