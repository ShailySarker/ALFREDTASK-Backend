const User = require("../models/userModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { signUpSchemaValidator, loginSchemaValidator } = require("../schemaValidator/authValidator");


//############## SIGN UP #############
const signUp = async (req, res) => {
    const validatedBody = await signUpSchemaValidator.validateAsync(req.body);
    const { fullname, email, password } = validatedBody;

    // Simple validation (you can enhance this)
    if (!fullname || !email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        // Check if the email or fullname already exists
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        // Create a new user
        const newUser = new User({
            fullname,
            email,
            password: CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET).toString(),
        });

        const savedUser = await newUser.save();
        res.status(201).json(
            {
                success: true,
                message: 'User registered successfully',
                data: savedUser
            },
        );

    } catch (error) {
        // console.error('Error during sign-up:', error);
        if (error.isJoi) {
            // Handle Joi validation errors
            return res.status(400).json({
                success: false,
                message: error.details.map((detail) => detail.message).join(', '),
            });
        }
        res.status(500).json({ success: false, message: "Sign up failed", error: error.message });
    }
}

// ########### LOGIN ############
const login = async (req, res) => {
    try {
        const validatedBody = await loginSchemaValidator.validateAsync(req.body);
        const { email, password } = validatedBody;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Wrong credentials for email" });
        }

        // Decrypt the password
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        // Check if the passwords match
        if (originalPassword !== password) {
            return res.status(401).json({ message: "Wrong credentials for password" });
        }

        // Generate JWT
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Send response without password
        const { password: _, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
        // res.status(200).json({ ...others, accessToken, message: "success" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
}

module.exports = {
    signUp,
    login
};