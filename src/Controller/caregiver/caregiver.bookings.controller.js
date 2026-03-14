const BookingModal = require("../../Modals/bookings.modal");
const CaregiverModal = require("../../Modals/caregiver.modal");
const sendMail = require("../../utils/sendMail");


const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = { caregiverId: req.client.id };

    if (status) {
      filter.status = status;
    }

    const bookings = await BookingModal.find(filter)
      .populate({
        path: "patientId",
        // remove select if you truly want ALL fields
        // select: "firstName lastName age gender mobileNumber address"
      })
      .populate({
        path: "userId",
        select: "firstName lastName mobileNumber profilePicture",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // 1️⃣ Update booking
    const booking = await BookingModal.findOneAndUpdate(
      { _id: bookingId },
      {
        caregiverId: req.client.id || req.client._id,
        bookingStatus: "accepted",
      },
      { returnDocument: "after" }
    ).populate("userId", "email firstName lastName"); // 👈 populate here

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // 2️⃣ Extract user email
    const userEmail = booking?.userId?.email;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email not found",
      });
    }

    // 3️⃣ Send Email
    const startDate = new Date(booking.schedule.startDate).toDateString();
    const name = booking?.userId?.firstName || "User";

    await sendMail({
      to: userEmail,
      subject: "Carely – Caregiver Accepted Your Booking",

      text: `
Hello ${name},

Your booking for ${booking.bookingServiceCategory} has been accepted by the caregiver.

Start Date: ${startDate}
Time Slot: ${booking.schedule.timeSlot}

Thank you for choosing Carely ❤️
`,

      html: `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
  <div style="max-width:500px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">

    <h2 style="color:#2c3e50; margin-bottom:20px;">
      Booking Accepted ✅
    </h2>

    <p style="font-size:15px; color:#555;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="font-size:15px; color:#555;">
      Your booking for <strong>${booking.bookingServiceCategory}</strong> has been accepted by the caregiver.
    </p>

    <div style="
      background:#f9fafb;
      padding:15px;
      border-radius:6px;
      margin:20px 0;
      border:1px solid #eee;
    ">
      <p style="margin:5px 0;"><strong>Start Date:</strong> ${startDate}</p>
      <p style="margin:5px 0;"><strong>Time Slot:</strong> ${booking.schedule.timeSlot}</p>
    </div>

    <p style="font-size:14px; color:#777;">
      The caregiver will arrive according to the scheduled time.
    </p>

    <p style="margin-top:20px; font-size:14px;">
      Thank you for choosing <strong>Carely</strong> ❤️
    </p>

  </div>
</div>
`
    });

    return res.status(200).json({
      success: true,
      message: "Booking accepted and email sent",
      data: booking,
    });
  } catch (error) {
    console.error("Accept Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept booking",
    });
  }
};

const cancleBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await BookingModal.findOneAndUpdate(
      { _id: bookingId, caregiverId: req.client.id },
      { status: "rejected" },
      { returnDocument: "after" }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking rejected",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reject booking",
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const caregiverId = req.client._id || req.client.id;

    const allowedStatuses = ["accepted", "in-progress", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // Update booking
    const booking = await BookingModal.findOneAndUpdate(
      { _id: bookingId, caregiverId: caregiverId },
      { bookingStatus: status },
      { returnDocument: "after" }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // If completed → Add earnings
    // if (status === "completed") {
    //   await CaregiverModal.findByIdAndUpdate(
    //     caregiverId,
    //     {
    //       $inc: { totalEarning: booking.grandTotal }
    //     },
    //     { new: true }
    //   );
    // }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: booking,
    });

  } catch (error) {
    console.error("Update Booking Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};

const addCareNote = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { note } = req.body;
    const caregiverId = req.client.id || req.client._id

    const updateCareNote = await BookingModal.findByIdAndUpdate({
      _id: bookingId,
      caregiverId: caregiverId,
    }, {
      careNotes: {
        note,
        addedBy: caregiverId,
        role: "caregiver"
      }
    });

    return res.status(201).json({
      success: true,
      message: "Care note added",
      data: updateCareNote,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add care note",
    });
  }
};

module.exports = {
  getMyBookings,
  acceptBooking,
  cancleBooking,
  updateBookingStatus, addCareNote
} 