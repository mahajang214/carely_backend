const CategoryModal = require("../../Modals/category.modal")

const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModal.find()
            .sort({ createdAt: -1 }).lean()

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message
        });
    }
};

module.exports = { getAllCategories }