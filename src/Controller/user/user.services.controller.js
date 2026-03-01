const categoryModal = require("../../Modals/category.modal");
const ServicesModal = require("../../Modals/services.modal");
const sendResponse = require("../../utils/apiResponse");



const filterServices = async (req, res) => {
    try {
        const {
            categoryName,
            page = 1,
            limit = 6
        } = req.query;

        const query = { isActive: true };

        if (categoryName) {
            query.categoryName = categoryName;
        }


        const services = await ServicesModal.find(query)
            .select("name basePrice slug pricingType categoryName")
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await ServicesModal.countDocuments(query);

        return sendResponse(res, 200, "Success", {
            data: services,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: Number(page)
            }
        });

    } catch (error) {
        console.log("Error : ", error.message)
        return sendResponse(res, 500, "Error", null);
    }
};




module.exports = { filterServices }