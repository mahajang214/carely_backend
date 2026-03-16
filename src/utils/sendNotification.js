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

const sendNotification = async ({ from, to, message, title, type, priority, recipientModel }) => {
    try {

        if (!from || !to || !message || !title || !type) {
            throw new Error("Missing required fields");
        }

        const newNotification = await notificationModal.create({
            senderModel: from,
            title,
            message,
            type,
            priority: priority || "normal",
            recipientId: to,
            recipientModel: recipientModel || "UserModal"
        });

        return { success: true };

    } catch (error) {
        console.error("Error sending notification:", error);
        return { success: false, error: error.message };
    }
};

module.exports = sendNotification;