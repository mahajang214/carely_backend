const mongoose = require("mongoose");
const BookingModal = require("../../Modals/bookings.modal");
const CaregiverModal = require("../../Modals/caregiver.modal");
const ReviewModal = require("../../Modals/reviews.modal")
const sendResponse = require("../../utils/apiResponse")

const updateCaregiverRating = async (caregiverId) => {
    const stats = await ReviewModal.aggregate([
        { $match: { caregiverId: new mongoose.Types.ObjectId(caregiverId) } },
        {
            $group: {
                _id: "$caregiverId",
                average: { $avg: "$rating" },
                totalReviews: { $sum: 1 },
                five: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
                four: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
                three: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
                two: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
                one: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } }
            }
        }
    ]);

    if (stats.length > 0) {
        await CaregiverModal.findByIdAndUpdate(caregiverId, {
            ratings: {
                average: stats[0].average,
                totalReviews: stats[0].totalReviews,
                count: {
                    five: stats[0].five,
                    four: stats[0].four,
                    three: stats[0].three,
                    two: stats[0].two,
                    one: stats[0].one
                }
            }
        });
    } else {
        // If all reviews deleted
        await CaregiverModal.findByIdAndUpdate(caregiverId, {
            ratings: {
                average: 0,
                totalReviews: 0,
                count: { five: 0, four: 0, three: 0, two: 0, one: 0 }
            }
        });
    }
};

const addReview = async (req, res) => {
    try {
        const { caregiverId, bookingId, rating, review } = req.body;
        const userId = req.client.id || req.client._id;

        // 🔥 CHECK DUPLICATE REVIEW
        const existingReview = await ReviewModal.findOne({
            bookingId,
            userId,
        });

        if (existingReview) {
            return sendResponse(res, 400, "Review already submitted");
        }

        const getCaregiver = await BookingModal.findById(bookingId).select("caregiverId patientId")
        if (!getCaregiver) {
            return sendResponse(res, 404, "Invalid", null);
        }

        const newReview = await ReviewModal.create({
            caregiverId: getCaregiver.caregiverId,
            patientId: getCaregiver.patientId,
            userId,
            bookingId,
            rating,
            review
        });

        await updateCaregiverRating(getCaregiver.caregiverId);

        return sendResponse(res, 200, "Review added successfully", { success: true, data: newReview });

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error");
    }
};

const updateReview = async (req, res) => {
    try {
        const { id: reviewId } = req.params;
        const userId = req.client.id || req.client._id;
        const { rating, review } = req.body;

        const updatedReview = await ReviewModal.findOneAndUpdate(
            { _id: reviewId, userId },
            { rating, review },
            { runValidators: true, returnDocument: "after" }
        );

        if (!updatedReview) {
            return sendResponse(res, 403, "Unauthorized or Review not found");
        }

        await updateCaregiverRating(updatedReview.caregiverId); // 🔥 important

        return sendResponse(res, 200, "Review updated", updatedReview);

    } catch (error) {
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

        const caregiverId = review.caregiverId;

        await review.deleteOne();

        await updateCaregiverRating(caregiverId); // 🔥 recalc

        return sendResponse(res, 200, "Review deleted successfully");

    } catch (error) {
        return sendResponse(res, 500, "Internal Server Error");
    }
};

const getReviews = async (req, res) => {
    try {
        const { category, rating, caregiverId } = req.query;

        const filter = {};

        if (category) filter.category = category;
        if (rating) filter.rating = Number(rating);
        if (caregiverId) filter.caregiverId = caregiverId;

        const reviews = await ReviewModal.find(filter)
            .populate("userId", "firstName lastName")
            .sort({ createdAt: -1 });

        return sendResponse(res, 200, "Success", reviews);

    } catch (error) {
        return sendResponse(res, 500, "Internal Server Error");
    }
};
module.exports = {
    addReview, updateReview,
    deleteReview,
    getReviews
}