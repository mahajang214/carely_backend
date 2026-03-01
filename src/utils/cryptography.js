const bcrypt = require("bcryptjs");

// Hash password
const encryptHash = async (password) => {
    try {
        if (!password) {
            throw new Error("Password not provided");
        }

        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        return hashedPassword;

    } catch (error) {
        console.error("Hash Error:", error.message);
        throw error;
    }
};

// Compare password
const compareHash = async (plainPassword, hashedPassword) => {
    try {
        if (!plainPassword || !hashedPassword) {
            throw new Error("Password values missing");
        }

        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

        return isMatch; // true or false

    } catch (error) {
        console.error("Compare Error:", error.message);
        throw error;
    }
};

module.exports = { encryptHash, compareHash };