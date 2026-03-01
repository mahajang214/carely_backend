const findAgeByDOB = async ({ dd, mm, yyyy }) => {
    try {

        if (!dd || !mm || !yyyy) return null;

        const birthDate = new Date(yyyy, mm - 1, dd);
        
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        // console.log("Age : ", age >= 0 ? age : 0)
        return age >= 0 ? age : 0;
    } catch (error) {
        console.error("Error calculating age:", error);
        return null;
    }
};

module.exports = findAgeByDOB;
