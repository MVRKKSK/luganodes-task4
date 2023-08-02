const user = require("../models/user.js")
const bcrypt = require("bcrypt")
const ActivityLog = require("../models/activity.js")
const jwt = require("jsonwebtoken")
const Emailvalidator = require("email-validator");
// const { sendVerificationEmail } = require("../helpers/mailer")
const logActivity = async(userId, action) => {
    try {
        const existingActivityLog = await ActivityLog.findOne({ user: userId });

        const newLog = {
            log: '',
            timestamp: new Date(), // This will set the timestamp to the current date and time
        };

        if (action === 'email') {
            newLog.log = 'login with email';
        } else if (action === 'web3') {
            newLog.log = 'login with web3';
        }

        if (existingActivityLog) {
            // If activity log exists for the user, update the logs array with the new log entry
            existingActivityLog.logs.push(newLog);
            await existingActivityLog.save();
        } else {
            // If activity log does not exist for the user, create a new activity log
            const activityLog = new ActivityLog({
                user: userId,
                action: action,
                logs: [newLog],
            });
            await activityLog.save();
        }
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};
exports.createUser = async(req, res) => {
        try {
            const { username, email, name, password } = req.body
            const checkUser = await user.findOne({ "email": email })
            if (checkUser) {
                res.status(404).json("email already available")
            }
            const validateEmail = Emailvalidator.validate(email)
            if (!validateEmail) return res.status(401).json("Invalid Email");
            const User = new user({
                username,
                password: password,
                email: email,
                name
            })
            const saltrounds = 10
            User.password = await bcrypt.hash(password, saltrounds)
            User.save()
            await logActivity(User.id, 'email');
            const token = jwt.sign({ id: User.id, authMethod: 'email' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.set('Authorization', token);
            res.status(200).json({ message: "Login successful", token: token });
            // const payload = { userId: User._id }
            // const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30m" })
            // const url = `${process.env.BASE_URL}/activateuser/${token}`
            // sendVerificationEmail(User.email, User.name, url);
            // const NewToken = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2d" })
            // res.json({
            //     id: User._id,
            //     username: User.username,
            //     name: User.name,
            //     token: NewToken,
            //     verified: User.verified,
            //     message: "Register Success ! please activate your email to start",
            // })
        } catch (err) {
            console.log(err)
        }
    }
    // exports.activateAccount = async(req, res) => {
    //     const { token } = req.body
    //     const User = jwt.verify(token, process.env.JWT_SECRET)
    //     const Check_Verified = await user.findById(User.userId)
    //     if (Check_Verified.verified == true) {
    //         res.status(400).json({ message: "User is already activated" })
    //     } else {
    //         await user.findByIdAndUpdate(User.userId, { verified: true })
    //         res.status(200).json({ message: "Your Email has been activated" })
    //     }
    // }