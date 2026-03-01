const ReviewModal = require("../../Modals/reviews.modal")
const sendResponse = require("../../utils/apiResponse")

const addReview = async (req, res) => {
    try {
        const { caregiverId,
            patientId,
            bookingId,
            rating,
            review } = req.body

        const userId = req.client.id || req.client._id

        const newReview = await ReviewModal.create({
            caregiverId,
            patientId,
            bookingId,
            userId,
            rating,
            review
        })
        if (!newReview) {
            return sendResponse(res, 400, "Something went wrong", newReview)
        }
        return sendResponse(res, 200, "Success", null)
    } catch (error) {
        return sendResponse(res, 400, "Error", null)
    }
}

const updateReview = async (req, res) => {
    try {
        const { id: reviewId } = req.params;
        const userId = req.client.id || req.client._id;
        const { rating, review } = req.body;

        const updatedReview = await ReviewModal.findOneAndUpdate(
            { _id: reviewId, userId: userId }, // 🔥 ownership check
            { rating, review },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return sendResponse(res, 403, "Unauthorized or Review not found");
        }

        return sendResponse(res, 200, "Review updated successfully", updatedReview);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error");
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id: reviewId } = req.params;
        const userId = req.client.id || req.client._id;

        const review = await ReviewModal.findById(reviewId);

        if (!review) {
            return sendResponse(res, 404, "Review not found");
        }

        if (review.userId.toString() !== userId.toString()) {
            return sendResponse(res, 403, "Unauthorized User");
        }

        await review.deleteOne();

        return sendResponse(res, 200, "Review deleted successfully");

    } catch (error) {
        console.error(error.message);
        return sendResponse(res, 500, "Internal Server Error");
    }
};

const getReviewsByCategory = async (req, res) => {
    try {
        // const {id:reviewId}=req.params;
        const { category, rating, caregiverId } = req.body;
        if (!category && !rating && !caregiverId) {
            return sendResponse(res, 412, "Preconditon failed", null)

        }

        const reviews = await ReviewModal.find({ $or: [category, ratings, caergiverId] });
        if (!reviews) {
            return sendResponse(res, 204, "No Content", null)

        }
        return sendResponse(res, 200, "Success", reviews)
    } catch (error) {
        return sendResponse(res, 400, "Error", null)
    }
}
module.exports = {
    addReview, updateReview,
    deleteReview,
    getReviewsByCategory
}