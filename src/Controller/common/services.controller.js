const ServicesModal = require("../../Modals/services.modal");


const getServices = async (req, res) => {
    try {
        const pageNumber = Number(req.query.page) || 1;
        const limitNumber = Number(req.query.limit) || 6;
        const { categoryName } = req.query;

        const query = { isActive: true };

        if (categoryName) {
            query.categoryName = categoryName;
        }

        const [services, total] = await Promise.all([
            ServicesModal.find(query)
                .select("name basePrice slug pricingType categoryName")
                .sort({ createdAt: -1 })
                .skip((pageNumber - 1) * limitNumber)
                .limit(limitNumber)
                .lean(),
            ServicesModal.countDocuments(query)
        ]);
        return res.status(200).json({
            success: true,
            data: services,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitNumber),
                currentPage: pageNumber
            }
        });

    } catch (error) {
        console.log("Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch services"
        });
    }
};

const getServiceInfo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({
                success: false,
                message: "Invalid ID"
            });
        }



        const service = await ServicesModal.findById(id);


        return res.status(200).json({
            success: true,
            data: service,
        });

    } catch (error) {
        console.log("Error : ", error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch service"
        });
    }
};



module.exports = { getServices, getServiceInfo }