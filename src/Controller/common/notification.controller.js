const NotificationModal = require("../../Modals/notification.modal")
const sendResponse = require("../../utils/apiResponse")


const getMyNotifications = async (req, res) => {
    try {
        const userId = req.client.id || req.client._id
        const myNofications = await NotificationModal.find({
            recipientId: userId,
        }).select("title message isRead createdAt")
        if (!myNofications) {
            return sendResponse(res, 204, "No content", null)
        }
        return sendResponse(res, 200, "Success", { data: myNofications })
    } catch (error) {
        return sendResponse(res, 400, "Error", null)
    }
}

const markNotificationAsRead = async (req, res) => {
    try {
        const { id: notificationId } = req.params
        const isNoficationsValid = await NotificationModal.findByIdAndUpdate(notificationId, { isRead: true },  { returnDocument: "after" });
        if (!isNoficationsValid) {
            return sendResponse(res, 400, "Not Valid", null)
        }
        return sendResponse(res, 200, "Success", isNoficationsValid)
    } catch (error) {
        return sendResponse(res, 400, "Error", null)
    }
}

const getMyUnreadNotifications = async (req, res) => {
    try {
        const userId = req.client.id || req.client._id
        const myNofications = await NotificationModal.find({
            recipientId: userId,
            recipientModel: "UserModal",
            isRead: false
        })
        if (!myNofications) {
            return sendResponse(res, 204, "No content", null)
        }
        return sendResponse(res, 200, "Success", { notifications: myNofications })
    } catch (error) {
        return sendResponse(res, 400, "Error", null)
    }
}

const deleteNotification = async (req, res) => {
    try {
        const { id: notificationId } = req.params
        const isNoficationsValid = await NotificationModal.findByIdAndDelete(notificationId);
        if (!isNoficationsValid) {
            return sendResponse(res, 400, "Not Valid", null)
        }
        return sendResponse(res, 200, "Success", isNoficationsValid)
    } catch (error) {
        return sendResponse(res, 400, "Error", null)
    }
}

const getDetailedNotification = async (req, res) => {
    try {
        const notificationId = req.params.id
        if (!notificationId) {
            return sendResponse(res, 204, "Invalid", null)
        }
        const myNofications = await NotificationModal.findById(notificationId)
        if (!myNofications) {
            return sendResponse(res, 204, "No content", null)
        }
        return sendResponse(res, 200, "Success", { data: myNofications })
    } catch (error) {
        return sendResponse(res, 400, "Error", null)
    }
}

module.exports = {
    getMyNotifications,
    markNotificationAsRead,
    getMyUnreadNotifications,
    deleteNotification,
    getDetailedNotification
}