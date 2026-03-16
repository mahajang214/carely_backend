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
        if (!from || !to || !message || !title || !type || !recipientModel) {
            throw new Error('Missing required fields: from, to, message, title, and type are all required.');
        }
        const newNotification = await notificationModal.create({
            senderModel: from.model,
            title,
            message,
            type,
            priority: priority || "normal",
            recipientId: to,
            recipientModal: recipientModel || "UserModal"
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