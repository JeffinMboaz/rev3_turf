const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user_Details");
const Manager = require("../models/manager");
const Admin = require("../models/admin");


// registration for user,manager,admin
// based in role data will be saved in corresponding DBmodels
// const registerAs = async (req, res) => {
//     try {
//         const { fullname, email, phonenumber, role, password, confirmpassword } = req.body;

//         if (!fullname || !email || !phonenumber || !role || !password || !confirmpassword) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         // Check email format
//         const emailRegex = /.+@.+\..+/;
//         if (!emailRegex.test(email)) {
//             return res.status(400).json({ message: "Invalid email format" });
//         }

//         if (password !== confirmpassword) {
//             return res.status(400).json({ message: "Passwords do not match" });
//         }

//         // Lowercase password before hashing
//         const passwordLower = password.toLowerCase();
//         const hashedPassword = await bcrypt.hash(passwordLower, 10);

//         const userData = { fullname, email, phonenumber, role, password: hashedPassword };

//         // Check email in respective model based on role only
//         if (role === "user") {
//             const existingUser = await User.findOne({ email });
//             if (existingUser) {
//                 return res.status(400).json({ message: "Email already registered as user" });
//             }
//             await new User(userData).save();
//         } else if (role === "manager") {
//             const existingManager = await Manager.findOne({ email });
//             if (existingManager) {
//                 return res.status(400).json({ message: "Email already registered as manager" });
//             }
//             await new Manager(userData).save();
//         } else if (role === "admin") {
//             const existingAdmin = await Admin.findOne({ email });
//             if (existingAdmin) {
//                 return res.status(400).json({ message: "Email already registered as admin" });
//             }
//             await new Admin(userData).save();
//         } else {
//             return res.status(400).json({ message: "Invalid role specified" });
//         }

//         res.status(201).json({ message: `${role} registered successfully` });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// };
const registerAs = async (req, res) => {
    try {
        const { fullname, email, phonenumber, role, password, confirmpassword } = req.body;

        // Check required fields
        if (!fullname || !email || !phonenumber || !role || !password || !confirmpassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if passwords match
        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Validate email format with improved regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password.toLowerCase(), 10);

        // Get createdBy only if admin is logged in
        const createdBy = req.user && req.user.role === 'admin' ? req.user._id : null;

        // Common user data
        const userData = {
            fullname,
            email,
            phonenumber,
            role,
            password: hashedPassword,
            ...(createdBy && { createdBy }) // Include createdBy if admin created
        };

        // Role-based user creation
        if (role === "user") {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already registered as user" });
            }
            await new User(userData).save();
        } else if (role === "manager") {
            const existingManager = await Manager.findOne({ email });
            if (existingManager) {
                return res.status(400).json({ message: "Email already registered as manager" });
            }
            await new Manager(userData).save();
        } else {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        res.status(201).json({ message: `${role} registered successfully` });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user;
        let role;

        // Try to find the user in each model
        user = await User.findOne({ email });
        if (user) role = "user";
        else {
            user = await Manager.findOne({ email });
            if (user) role = "manager";
            else {
                user = await Admin.findOne({ email });
                if (user) role = "admin";
            }
        }

        // If not found in any model
        if (!user) {
            return res.status(401).json({ message: "Invalid email" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password.toLowerCase(), user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, email: user.email, role },
            process.env.JWT_SECRETKEY,
            { expiresIn: "1d" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Send dashboard route as part of response
        let redirectTo;
        if (role === "user") redirectTo = "/userdashboard";
        else if (role === "manager") redirectTo = "/managerdashboard";
        else if (role === "admin") redirectTo = "/admindashboard";

        return res.status(200).json({
            message: `${role} login successful`,
            redirectTo,
            token, // ✅ Add this line
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// LOGOUT
const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
};

// Get user profile based on token
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // This will come from the JWT token

        // Find the user based on role
        let user;
        if (req.user.role === "user") {
            user = await User.findById(userId);
        } else if (req.user.role === "manager") {
            user = await Manager.findById(userId);
        } else if (req.user.role === "admin") {
            user = await Admin.findById(userId);
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            fullname: user.fullname,
            email: user.email,
            phonenumber: user.phonenumber
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user profile based on token

const updateUserProfile = async (req, res) => {
    try {
        const { fullname, email, phonenumber, password } = req.body;
        const userId = req.user.id;

        let user;
        if (req.user.role === "user") {
            user = await User.findById(userId);
        } else if (req.user.role === "manager") {
            user = await Manager.findById(userId);
        } else if (req.user.role === "admin") {
            user = await Admin.findById(userId);
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the fields
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.phonenumber = phonenumber || user.phonenumber;

        // If password is provided, hash it and update
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password.toLowerCase(), salt);
            user.password = hashedPassword;
        }

        await user.save();

        res.status(200).json({ message: "Profile updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { registerAs,login,logout,getUserProfile,updateUserProfile };
