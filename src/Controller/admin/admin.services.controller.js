const categoryModal = require("../../Modals/category.modal");
const ServicesModal = require("../../Modals/services.modal");
const BookingModal = require("../../Modals/bookings.modal");
const sendResponse = require("../../utils/apiResponse");
const slugify = require("slugify");


// ============================
// ✅ ADD SERVICE
// ============================
const addService = async (req, res) => {
    try {
        const {
            name,
            description,
            basePrice,
            categoryName,
            requiredQualification
        } = req.body;

        const createdBy = req.client.id || req.client._id;

        if (!name || !description || !basePrice || !categoryName) {
            return sendResponse(res, 400, "All required fields must be provided", null);
        }

        const category = await categoryModal.findOne({ name: categoryName });
        if (!category) {
            return sendResponse(res, 404, "Invalid Category", null);
        }

        const slug = slugify(name, { lower: true, strict: true });

        const existingService = await ServicesModal.findOne({ slug });
        if (existingService) {
            return sendResponse(res, 400, "Service already exists", null);
        }

        const newService = await ServicesModal.create({
            name,
            slug,
            description,
            basePrice,
            pricingType: "shift",
            category: category._id,
            categoryName: category.name,
            requiredQualification,
            createdBy
        });

        return sendResponse(res, 201, "Service added successfully", newService);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Failed to add service", null);
    }
};

const updateService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const ownerId = req.client.id || req.client._id;

        const {
            name,
            description,
            basePrice,
            requiredQualification,
            categoryName
        } = req.body;

        const service = await ServicesModal.findById(serviceId);
        if (!service) {
            return sendResponse(res, 404, "Service not found", null);
        }

        if (service.createdBy?.toString() !== ownerId) {
            return sendResponse(res, 403, "Unauthorized", null);
        }

        let slug = service.slug;
        if (name && name !== service.name) {
            slug = slugify(name, { lower: true, strict: true });

            const slugExists = await ServicesModal.findOne({ slug });
            if (slugExists && slugExists._id.toString() !== serviceId) {
                return sendResponse(res, 400, "Service with this name already exists", null);
            }
        }

        let categoryId = service.category;
        let updatedCategoryName = service.categoryName;

        if (categoryName) {
            const category = await categoryModal.findOne({ name: categoryName });
            if (!category) {
                return sendResponse(res, 404, "Invalid Category", null);
            }
            categoryId = category._id;
            updatedCategoryName = category.name;
        }

        const updatedService = await ServicesModal.findByIdAndUpdate(
            serviceId,
            {
                ...(name && { name }),
                ...(description && { description }),
                ...(basePrice && { basePrice }),
                ...(requiredQualification && { requiredQualification }),
                category: categoryId,
                categoryName: updatedCategoryName,
                slug
            },
            { new: true }
        ).populate("category");

        return sendResponse(res, 200, "Service updated successfully", updatedService);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Failed to update service", null);
    }
};

const removeService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const ownerId = req.client.id || req.client._id;
        // console.log("OWNER ID : ", ownerId)

        const service = await ServicesModal.findById(serviceId);

        if (!service) {
            return sendResponse(res, 404, "Service not found", null);
        }

        if (service.createdBy?.toString() !== ownerId) {
            return sendResponse(res, 403, "Unauthorized", null);
        }

        await ServicesModal.findByIdAndDelete(serviceId);

        return sendResponse(res, 200, "Service removed successfully", null);

    } catch (error) {
        return sendResponse(res, 500, "Failed to remove service", null);
    }
};

const getMostBookedServices = async (req, res) => {
    try {
        const mostBookedServices = await BookingModal.aggregate([
            { $match: { requestStatus: "accepted" } },
            { $group: { _id: "$serviceId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "servicesmodals", // collection name (lowercase)
                    localField: "_id",
                    foreignField: "_id",
                    as: "serviceDetails"
                }
            },
            { $unwind: "$serviceDetails" },
            {
                $project: {
                    serviceId: "$_id",
                    serviceName: "$serviceDetails.name",
                    bookingCount: "$count"
                }
            }
        ]);

        return sendResponse(res, 200, "Most booked services retrieved successfully", mostBookedServices);

    } catch (error) {
        return sendResponse(res, 500, "Failed to retrieve most booked services", null);
    }
};

const removeQualification = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { qualification } = req.body;
        const ownerId = req.client.id || req.client._id;

        if (!qualification) {
            return sendResponse(res, 400, "Qualification is required", null);
        }

        const service = await ServicesModal.findById(serviceId);
        if (!service) {
            return sendResponse(res, 404, "Service not found", null);
        }

        if (service.createdBy?.toString() !== ownerId) {
            return sendResponse(res, 403, "Unauthorized", null);
        }

        const updatedService = await ServicesModal.findByIdAndUpdate(
            serviceId,
            { $pull: { requiredQualification: qualification } },
            { new: true }
        );

        return sendResponse(res, 200, "Qualification removed successfully", updatedService);

    } catch (error) {
        return sendResponse(res, 500, "Failed to remove qualification", null);
    }
};

const createCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const adminId = req.client.id || req.client._id
        if (!categoryName) { return sendResponse(res, 404, "No found", null) }
        const isCategoryExist = await categoryModal.findOne({ name: categoryName });
        if (isCategoryExist) { return sendResponse(res, 226, "Already Used", newCategory) }
        const newCategory = await categoryModal.create({ name: categoryName, createdBy: adminId })
        return sendResponse(res, 200, "Successful", newCategory)
    } catch (error) {
        console.log("Error : ", error.message)
        return sendResponse(res, 500, "Something went wrong", null)
    }

}

module.exports = {
    getMostBookedServices,
    addService,
    removeService,
    updateService,
    createCategory,
    removeQualification,
}