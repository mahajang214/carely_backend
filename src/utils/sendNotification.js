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
    EVENT_NOTIFICATION: "event_notification"
};

const sendNotification = async ({ from, to, message, title, type, priority }) => {
    try {
        if (!from || !to || !message || !title || !type) {
            throw new Error('Missing required fields: from, to, message, title, and type are all required.');
        }
        if (!Object.values(NOTIFICATION_TYPES).includes(type)) {
            throw new Error(`Invalid notification type. Valid types are: ${Object.values(NOTIFICATION_TYPES).join(", ")}`);
        }
        const newNotification = await notificationModal.create({
            senderModel: from.model,
            title,
            message,
            type,
            priority: priority || "normal",
            recipientId: to.id,
            recipientModal: to.model
        });


        // Simulate sending notification (e.g., via email or SMS)
        // console.log(`Notification sent from ${from} to ${to}: ${message}`);
        return { success: true, message: 'Notification sent successfully' };
    } catch (error) {
        console.error('Error sending notification:', error);
        return { success: false, message: 'Failed to send notification', error: error.message };
    }
}

module.exports = sendNotification;