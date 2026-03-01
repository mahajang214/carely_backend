const mongoose = require("mongoose");

const servicesModalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        slug: {
            type: String,
            unique: true,
            required: true,
            index: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CategoryModal",
            required: true,
            index: true
        },
        basePrice: { type: Number, required: true },
        categoryName: String,
        pricingType: {
            type: String,
            enum: ["shift"],
            default: "shift"
        },
        durationOptions: [
            {
                hours: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],

        requiredQualification: {
            type: [String],
            required: true,
            default: []
        },


        isActive: {
            type: Boolean,
            default: true,
            index: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AdminModal"
        }

    },
    { timestamps: true }
);

// 🔥 Compound index for filtering
servicesModalSchema.index({
    isActive: 1,
    categoryName: 1,
    createdAt: -1
});
servicesModalSchema.pre("save", function () {

    if (
        this.isModified("basePrice") ||
        this.isModified("pricingType")
    ) {
        if (this.pricingType === "shift" && this.basePrice) {
            this.durationOptions = [
                {
                    hours: 8,
                    price: this.basePrice * 8
                },
                {
                    hours: 12,
                    price: Math.max(this.basePrice * 12 - 200, 0)
                },
                {
                    hours: 24,
                    price: Math.max(this.basePrice * 24 - 300, 0)
                }
            ];
        }
    }


});

const ServicesModal = mongoose.model("ServicesModal", servicesModalSchema);
module.exports = ServicesModal;