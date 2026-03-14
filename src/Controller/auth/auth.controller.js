const dotenv = require('dotenv')
dotenv.config();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const UserModal = require('../../Modals/user.modal.js');
const CaregiverModal = require('../../Modals/caregiver.modal');
const AdminModal = require("../../Modals/admin.modal.js")
const sendResponse = require('../../utils/apiResponse.js');
const OtpRequest = require('../../Modals/otp.modal');
const { generateOTP, hashOTP } = require('../../utils/otpHelper');
const findAgeByDOB = require('../../utils/findAgebyDOB.js');
const sendMail = require('../../utils/sendMail.js');
const { default: mongoose } = require('mongoose');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// cloudinary setup
const { v2: cloudinary } = require("cloudinary");
const PatientModal = require('../../Modals/patient.modal.js');
// google token verification helper
const verifyGoogleToken = require('../../utils/verifyGoogleToken.js');
const { encryptHash, compareHash } = require('../../utils/cryptography.js');
// config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_ROLES = ["user", "caregiver", "patient", "family", "admin"];

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 1000
};


const login = async (req, res) => {
    try {
        const { token, role } = req.body;
        // console.log("Login Request Body: ", req.body)
        if (!token) {
            return res.status(400).json({ message: "Google token required" });
        }

        if (!ALLOWED_ROLES.includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        const payload = await verifyGoogleToken(client, token);
        const { sub: googleId, email, name, picture } = payload;

        // Admin login
        // if (email === process.env.OWNER_EMAIL) {
        //     const jwtToken = jwt.sign(
        //         { id: googleId, googleId, role: "admin", profilePic: picture },
        //         process.env.JWT_SECRET,
        //         { expiresIn: "1h" }
        //     );

        //     res.cookie("accessToken", jwtToken, cookieOptions);

        //     return res.status(200).json({
        //         message: "Login successful",
        //         token: jwtToken,
        //         user: { id: googleId, name, role: "admin", profilePic: picture, },
        //     });
        // }
        if (role === "admin") {

            const isAdminExist = await AdminModal
                .findOne({ email })
                .select("+googleId");

            if (!isAdminExist) {
                return res.status(404).json({ message: "Admin not registered" });
            }

            // First time Google login → attach googleId
            if (!isAdminExist.googleId) {
                isAdminExist.googleId = googleId;
                await isAdminExist.save();
            }

            const jwtToken = jwt.sign(
                { id: isAdminExist._id, googleId, role: "admin", profilePic: picture },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.cookie("accessToken", jwtToken, cookieOptions);

            return res.status(200).json({
                message: "Login successful",
                token: jwtToken,
                user: {
                    id: isAdminExist._id,
                    name,
                    role: "admin",
                    profilePic: picture
                },
            });
        }

        // ✅ User / Family login
        if (role === "user" || role === "family") {
            const existingUser = await UserModal.findOne({ googleId, blocked: false });

            if (!existingUser) {
                return res.status(404).json({ message: "User not registered" });
            }

            existingUser.lastActiveAt = new Date();
            await existingUser.save();

            const jwtToken = jwt.sign(
                {
                    id: existingUser._id,
                    googleId,
                    role: existingUser.role,
                    profilePic: existingUser.profilePicture,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.cookie("accessToken", jwtToken, cookieOptions);

            return res.status(200).json({
                message: "Login successful",
                token: jwtToken,
                user: {
                    id: existingUser._id,
                    name,
                    role: existingUser.role,
                    profilePic: existingUser.profilePicture,
                    linkedPatients: existingUser.linkedPatients
                },
            });
        }

        // ✅ Caregiver login
        if (role === "caregiver") {
            const existingCaregiver = await CaregiverModal.findOne({ googleId, blocked: false });

            if (!existingCaregiver) {
                return res.status(404).json({ message: "Caregiver not registered" });
            }

            const jwtToken = jwt.sign(
                {
                    id: existingCaregiver._id,
                    googleId,
                    role: existingCaregiver.role,
                    profilePic: existingCaregiver.profilePicture,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.cookie("accessToken", jwtToken, cookieOptions);

            return res.status(200).json({
                message: "Login successful", token: jwtToken,
                user: {
                    id: existingCaregiver._id,
                    name,
                    role: existingCaregiver.role,
                    profilePic: existingCaregiver.profilePicture,
                },
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Authentication failed" });
    }
};

const register = async (req, res) => {
    try {
        const { token, role } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Google token required" });
        }

        if (!ALLOWED_ROLES.includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        const payload = await verifyGoogleToken(client, token);
        const { sub: googleId, email, name, picture } = payload;

        // Common Fields
        const {
            address = {},
            dob = {},
            mobileNumber,
            gender,
            availabilityAndLocation = [],
            qualifications = [],
            verificationDocuments,
            readyForService,
        } = req.body;

        const {
            fullAddress,
            city,
            state,
            pincode,
            coordinates = {}
        } = address;

        const { type: coordType, coordinates: coords } = coordinates;
        const [lng, lat] = coords || [];

        const { dd, mm, yyyy } = dob;

        const age = await findAgeByDOB({ dd, mm, yyyy });
        if (age < 0) {
            return res.status(400).json({ message: "Invalid date of birth" });
        }

        // ✅ USER / FAMILY REGISTRATION
        if (role === "user" || role === "family") {

            const existingUser = await UserModal.findOne({ googleId });
            if (existingUser) {
                return res.status(400).json({ message: "User already registered" });
            }

            if (!fullAddress || !city || !state || !pincode || !coords?.length || !mobileNumber || !gender) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const user = await UserModal.create({
                firstName: name.split(" ")[0],
                lastName: name.split(" ")[1] || "",
                email,
                googleId,
                role,
                profilePicture: picture,
                address: {
                    fullAddress,
                    city,
                    state,
                    pincode,
                    coordinates: {
                        type: "Point",
                        coordinates: [lng, lat], // GeoJSON: [longitude, latitude]
                    },
                },
                dateOfBirth: `${dd}-${mm}-${yyyy}`,
                mobileNumber,
                gender,
                age,
                lastActiveAt: new Date()
            });

            return res.status(201).json({
                message: "User registered successfully",
                user: { id: user._id, role: user.role }
            });
        }

        // ✅ CAREGIVER REGISTRATION
        if (role === "caregiver") {

            const existingCaregiver = await CaregiverModal.findOne({ googleId });
            if (existingCaregiver) {
                return res.status(400).json({ message: "Caregiver already registered" });
            }

            if (!fullAddress || !city || !state || !pincode || !coords?.length ||
                !mobileNumber || !gender || !qualifications ||
                !verificationDocuments || !readyForService ||
                !availabilityAndLocation) {
                // console.log("Error Fields : ", fullAddress, city, state, pincode, coords, mobileNumber, gender, qualifications, verificationDocuments, readyForService, availabilityAndLocation)
                return res.status(400).json({ message: "Missing required fields" });
            }

            const caregiver = await CaregiverModal.create({
                firstName: name.split(" ")[0],
                lastName: name.split(" ")[1] || "",
                email,
                googleId,
                role,
                profilePicture: picture,
                address: {
                    fullAddress,
                    city,
                    state,
                    pincode,
                    coordinates: {
                        type: "Point",
                        coordinates: [lng, lat], // GeoJSON: [longitude, latitude]
                    },
                },
                dob: `${dd}-${mm}-${yyyy}`,
                mobileNumber,
                gender,
                qualifications,
                verificationDocuments,
                readyForService,
                availabilityAndLocation,
                age
            });

            return res.status(201).json({
                message: "Caregiver registered successfully",
                user: { id: caregiver._id, role: caregiver.role }
            });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Registration failed" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return sendResponse(res, 404, "Invalid Username or Password", null);
        }
        const patient = await PatientModal.findOne({ username }).select("password username");
        // check password is correct or not

        if (!patient) {
            return sendResponse(res, 400, "Something went wrong", null);
        }

        const hashedPassword = await encryptHash(password);

        patient.password = hashedPassword;
        await patient.save();

        const patientResponse = patient.toObject();
        delete patientResponse.password;


        const jwtToken = jwt.sign(
            {
                id: patient._id,
                role: patient.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000,
        });


        res.status(201).json({
            message: "Password reset successful",
            token: jwtToken,
            user: patientResponse
        });


    } catch (error) {
        console.log("Error : ", error.message)
        return sendResponse(res, 500, "Something went wrong", null);
    }
}

const checkUsername = async (req, res) => {
    const { username } = req.params;
    try {
        const userExists = await UserModal.findOne({ username });
        const patientExists = await PatientModal.findOne({ username });
        const caregiverExists = await CaregiverModal.findOne({ username });
        if (userExists) {
            return res.status(200).json({ exists: true, userId: userExists._id });
        } else if (patientExists) {
            return res.status(200).json({ exists: true, userId: patientExists._id });
        } else if (caregiverExists) {
            return res.status(200).json({ exists: true, userId: caregiverExists._id });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking username:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const checkOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const { id: userId } = req.params;

        if (!userId || !otp) {
            return sendResponse(res, 400, "OTP and userId required");
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return sendResponse(res, 400, "Invalid userId format");
        }

        const otpRequest = await OtpRequest.findOne({ userId }).sort({ createdAt: -1 });

        // console.log("Found OTP request:", otpRequest);
        // console.log("current time : ", Date.now())

        if (!otpRequest) {
            return sendResponse(res, 400, "OTP not found");
        }

        if (Date.now() > otpRequest.expiresAt.getTime()) {
            await otpRequest.deleteOne();
            return sendResponse(res, 400, "OTP expired");
        }

        const cleanOtp = String(otp).trim();

        if (hashOTP(cleanOtp) !== otpRequest.otpHash) {
            return sendResponse(res, 400, "Invalid OTP");
        }

        // ✅ OTP verified
        await otpRequest.deleteOne();

        return sendResponse(res, 200, "OTP verified successfully");

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal server error");
    }
};

const searchUserForPatient = async (req, res) => {
    try {
        const { id: numOrEmail } = req.params;

        const escapeRegex = (text) =>
            text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const search = escapeRegex(numOrEmail);

        const users = await UserModal.find({
            $or: [
                { email: { $regex: search, $options: "i" } },
                { mobileNumber: { $regex: `^${search}`, $options: "i" } }
            ],
            isActive: true,
            blocked: false
        }).select("firstName lastName profilePicture mobileNumber email");


        if (!users || users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }


        return res.status(200).json({
            message: "User found",
            data: users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const sendOTP = async (req, res) => {
    try {
        const { condition } = req.body;
        if (condition === "forgot-password") {
            // console.log("BODY: ", req.body);
            const { id, name } = req.body;
            const getEmergencyContactEmail = await PatientModal.findById(id).select("emergencyContact responsibleUserId");
            if (!getEmergencyContactEmail) {
                // console.log("Patient not found for ID:", id);
                return sendResponse(res, 404, "Patient not found", null);
            }
            // console.log("getEmergencyContactEmail: ", getEmergencyContactEmail)

            const responsibleUser = await UserModal.findOne({ _id: getEmergencyContactEmail.emergencyContact.responsibleUserId }).select("+email firstName lastName");
            if (!responsibleUser) {
                // console.log("Responsible user not found for ID:", id);
                return sendResponse(res, 404, "Responsible user not found", null);
            }
            const otp = generateOTP();
            const otpHash = hashOTP(otp);

            await OtpRequest.deleteMany({ id });

            await OtpRequest.create({
                userId: id,
                otpHash,
                patientName: name,
                relationship: "Forgot Password",
                expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 min
            });

            await sendMail({
                to: responsibleUser.email,
                subject: "Carely – Password Reset OTP",

                text: `
Hello ${responsibleUser.firstName} ${responsibleUser.lastName},

We received a request to reset your password.

Your One-Time Password (OTP) is: ${otp}

This OTP will expire in 10 minutes.

If you did not request this, please ignore this email.

– Carely Team
`,

                html: `
<div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
  <div style="max-width:500px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
    
    <h2 style="color:#2c3e50; margin-bottom:20px;">
      Password Reset Request
    </h2>

    <p style="font-size:15px; color:#555;">
      Hello <strong>${responsibleUser.firstName} ${responsibleUser.lastName}</strong>,
    </p>

    <p style="font-size:15px; color:#555;">
      We received a request to reset your password for your Carely account.
    </p>

    <div style="margin:25px 0; text-align:center;">
      <span style="
        display:inline-block;
        background-color:#4f46e5;
        color:#ffffff;
        font-size:22px;
        letter-spacing:4px;
        padding:12px 24px;
        border-radius:6px;
        font-weight:bold;
      ">
        ${otp}
      </span>
    </div>

    <p style="font-size:14px; color:#777;">
      This OTP will expire in <strong>10 minutes</strong>.
    </p>

    <p style="font-size:14px; color:#777;">
      Do not share this code with anyone.
    </p>

    <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

    <p style="font-size:12px; color:#999;">
      If you did not request a password reset, you can safely ignore this email.
    </p>

    <p style="font-size:13px; color:#555; margin-top:20px;">
      – Carely Team
    </p>

  </div>
</div>
`
            });


            return sendResponse(
                res,
                200,
                "FORGOT OTP sent successfully"
            );
        }
        // console.log("BODY: ", req.body);

        const { id: userId, name, relationship } = req.body;

        if (!name || !relationship) {
            return sendResponse(res, 400, "Name and relationship are required");
        }
        const responsibleUser = await UserModal.findById(userId).select("+email");
        if (!responsibleUser) {
            return sendResponse(res, 404, "Responsible user not found");
        }
        // console.log("RESPONSIBLE EMAIL : ", responsibleUser.email)

        const otp = generateOTP();
        const otpHash = hashOTP(otp);

        await OtpRequest.deleteMany({ userId });

        await OtpRequest.create({
            userId,
            otpHash,
            patientName: name,
            relationship,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 min
        });

        await sendMail({
            to: responsibleUser.email,
            subject: "Carely – Patient Verification OTP",
            text: `
==============================
      CARELY VERIFICATION
==============================

Hello,

Patient Name : ${name}
Relationship : ${relationship}

--------------------------------
Your OTP Code
--------------------------------

        ${otp}

This OTP will expire in 10 minutes.

⚠ Do not share this OTP with anyone.

--------------------------------
Carely Team
`,
        });

        return sendResponse(
            res,
            200,
            "OTP sent successfully"
        );

    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Internal server error");
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "Logged out successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Logout failed",
        });
    }
};


// when user accepts the req then we will add the relationship in db and send notification to patient that req accepted by user and now they can access patient data and also send notification to user that they accepted req of patient and now they can access patient data


const createNewPatient = async (req, res) => {
    try {
        const {
            dob = {},
            address = {},
            gender,
            emergencyContact = {},
            bloodGroup,
            allergies = [],
            chronicConditions = [],
            firstName,
            lastName,
            medicalNeeds = [],
            username,
            password
        } = req.body;

        const { dd, mm, yyyy } = dob;

        const {
            fullAddress,
            city,
            state,
            pincode,
            coordinates = {}
        } = address;

        const { type: coordType, coordinates: coords } = coordinates;
        const [lng, lat] = coords || [];

        const {
            name,
            phoneNo,
            responsibleUserId,
            relationship
        } = emergencyContact;

        // Proper validation
        if (
            !dd || !mm || !yyyy ||
            !firstName || !lastName ||
            !gender ||
            !name || !phoneNo || !responsibleUserId ||
            !fullAddress || !city || !state || !pincode ||
            !coords.length ||
            !password
        ) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const age = await findAgeByDOB({ dd, mm, yyyy });

        if (age < 0) {
            return res.status(400).json({ message: "Invalid date of birth" });
        }

        const formattedDOB = new Date(`${yyyy}-${mm}-${dd}`);

        const hashedPassword = await encryptHash(password);

        const newPatient = new PatientModal({
            firstName,
            lastName,
            age,
            dateOfBirth: formattedDOB,
            address: {
                fullAddress,
                city,
                state,
                pincode,
                coordinates: {
                    type: "Point",
                    coordinates: [lng, lat], // GeoJSON: [longitude, latitude]
                }
            },
            bloodGroup,
            allergies,
            chronicConditions,
            emergencyContact: { name, phoneNo, responsibleUserId, relationship },
            medicalNeeds,
            username,
            password: hashedPassword,
            lastActiveAt: new Date()
        });

        await newPatient.save();

        await UserModal.findByIdAndUpdate(
            responsibleUserId,
            {
                $push: {
                    linkedPatients: {
                        patientId: newPatient._id,
                        relationship,
                        patientName: `${firstName} ${lastName}`
                    }
                }
            }
        );

        const jwtToken = jwt.sign(
            {
                id: newPatient._id,
                role: newPatient.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000,
        });

        const patientResponse = newPatient.toObject();
        delete patientResponse.password;

        res.status(201).json({
            message: "New patient created successfully",
            token: jwtToken,
            user: patientResponse
        });

    } catch (error) {
        console.error("Error creating new patient:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// delete doc
const deleteDocuments = async (req, res) => {
    try {
        // console.log("Incoming body:", req.body);

        const { publicIds } = req.body;

        if (!publicIds || !Array.isArray(publicIds)) {
            return res.status(400).json({
                message: "publicIds must be an array",
            });
        }

        const results = await Promise.all(
            publicIds.map((id) =>
                cloudinary.uploader.destroy(id)
            )
        );

        // console.log("Cloudinary delete results:", results);

        res.json({ success: true });
    } catch (error) {
        console.error("DELETE ERROR:", error.message);

        res.status(500).json({
            message: error.message || "Deletion failed",
        });
    }
};

const patientLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        // console.log("BODY: ", req.body)

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }

        const patient = await PatientModal.findOne({ username }).select("+password");

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const isPasswordValid = await compareHash(password, patient.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const jwtToken = jwt.sign(
            { id: patient._id, role: patient.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000,
        });

        const patientResponse = patient.toObject();
        delete patientResponse.password;

        // console.log("Patient Login Successful:", { id: patient._id, username: patient.username });
        res.status(200).json({
            message: "Login successful",
            token: jwtToken,
            user: patientResponse
        });

    } catch (error) {
        console.error("Patient Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = {
    login, register, forgotPassword,
    searchUserForPatient, checkUsername,
    sendOTP,
    checkOTP,
    createNewPatient, logout,
    deleteDocuments, patientLogin
};