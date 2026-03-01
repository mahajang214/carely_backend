const sendResponse = require("../../utils/apiResponse.js");
const NotificationModal = require("../../Modals/notification.modal.js");
const UserModal = require("../../Modals/user.modal.js");
const CaregiverModal = require("../../Modals/caregiver.modal.js");

const createNotifications = async ({
    recipients,
    recipientModel,
    senderId,
    senderModel,
    title,
    message,
    type,
    priority,
}) => {
    const notifications = recipients.map((recipient) => ({
        recipientId: recipient._id,
        recipientModel,
        senderId,
        senderModel,
        title,
        message,
        type: type || "system",
        priority: priority || "high",
        deliveryChannels: {
            inApp: true,
            email: false,
            sms: false,
        },
    }));

    return NotificationModal.insertMany(notifications);
};

// 🔔 Broadcast to Users
const broadcastUsers = async (req, res) => {
    try {
        const { title, message, type, priority } = req.body;

        if (!title || !message) {
            return sendResponse(res, 400, "Title and message are required", null);
        }

        const users = await UserModal.find({}, "_id");

        await createNotifications({
            recipients: users,
            recipientModel: "UserModal",
            senderId: req.user?._id,
            senderModel: "AdminModal",
            title,
            message,
            type,
            priority,
        });

        return sendResponse(res, 200, "Notification sent to all users successfully", null);
    } catch (error) {
        console.error("Broadcast Users Error:", error);
        return sendResponse(res, 500, "Failed to send notification to users", null);
    }
};

// 🔔 Broadcast to Caregivers
const broadcastCaregivers = async (req, res) => {
    try {
        const { title, message, type, priority } = req.body;

        if (!title || !message) {
            return sendResponse(res, 400, "Title and message are required", null);
        }

        const caregivers = await CaregiverModal.find({}, "_id");

        await createNotifications({
            recipients: caregivers,
            recipientModel: "CaregiverModal",
            senderId: req.user?._id,
            senderModel: "AdminModal",
            title,
            message,
            type,
            priority,
        });

        return sendResponse(res, 200, "Notification sent to all caregivers successfully", null);
    } catch (error) {
        console.error("Broadcast Caregivers Error:", error);
        return sendResponse(res, 500, "Failed to send notification to caregivers", null);
    }
};

// 🔔 Broadcast to All
const broadcast = async (req, res) => {
    try {
        const { title, message, type, priority } = req.body;

        if (!title || !message) {
            return sendResponse(res, 400, "Title and message are required", null);
        }

        const [users, caregivers] = await Promise.all([
            UserModal.find({}, "_id"),
            CaregiverModal.find({}, "_id"),
        ]);

        await Promise.all([
            createNotifications({
                recipients: users,
                recipientModel: "UserModal",
                senderId: req.user?._id,
                senderModel: "AdminModal",
                title,
                message,
                type,
                priority,
            }),
            createNotifications({
                recipients: caregivers,
                recipientModel: "CaregiverModal",
                senderId: req.user?._id,
                senderModel: "AdminModal",
                title,
                message,
                type,
                priority,
            }),
        ]);

        return sendResponse(res, 200, "Notification sent to all users and caregivers successfully", null);
    } catch (error) {
        console.error("Broadcast All Error:", error);
        return sendResponse(res, 500, "Failed to send notification", null);
    }
};

module.exports = {
    broadcastUsers,
    broadcastCaregivers,
    broadcast,
};