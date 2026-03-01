const BookingModal = require("../../Modals/bookings.modal");

const addCareNote = async (req, res) => {
    try {
        const { note, bookingId } = req.body;

        const userRole = req.client.role

        if (!note || !bookingId) {
            return res.status(400).json({
                success: false,
                message: "Note is required",
            });
        }

        await BookingModal.findByIdAndUpdate(
            bookingId,
            {
                $push: {
                    careNotes: {
                        note,
                        addedBy: req.client._id,
                        roleModel: userRole === "caregiver" ? "CaregiverModal" : "UserModal",
                        senderRole: userRole,
                        createdAt: new Date(),
                    },
                },
            },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: "Care note added successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add care note",
        });
    }
};

const getAllCareNotes = async (req, res) => {
    try {
        const userId = req.client.id || req.client._id;
        const userRole = req.client.role;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const filter = {
            bookingStatus: { $in: ["accepted", "in-progress"] }
        };

        if (userRole === "user" || userRole === "member") {
            filter.userId = userId;
        }

        if (userRole === "caregiver") {
            filter.caregiverId = userId;
        }

        const totalBookings = await BookingModal.countDocuments(filter);

        const bookings = await BookingModal.find(filter)
            .select("bookingServiceCategory  _id")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalBookings / limit),
                totalBookings
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
        });
    }
};

const getCareNote = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        // console.log("Booking ID : ", req.params.id)

        const booking = await BookingModal.findById(bookingId).select("careNotes");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        const totalNotes = booking.careNotes.length;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedNotes = booking.careNotes
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(startIndex, endIndex);

        return res.status(200).json({
            success: true,
            data: paginatedNotes,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalNotes / limit),
                totalNotes,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch care notes",
        });
    }
};


module.exports = {
    addCareNote, getAllCareNotes, getCareNote
}