const user = require("../models/user.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
    // const followers = require("../models/followers")
const Emailvalidator = require("email-validator");
const ActivityLog = require("../models/activity.js")

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

exports.getUserDetails = async(req, res) => {
    const userId = await req.userId
    console.log(req.authMethod)
    console.log(userId)
    try {
        const userData = await user.findById({ _id: userId })
        userData.authMethod = req.authMethod;
        res.status(200).json({ userData })
    } catch (err) {
        res.status(401).json({ message: err })
    }
}
exports.getLogsByUserId = async(req, res) => {
    // const { userId } = req.body;
    try {
        const userId = await req.userId
        console.log(userId)
        const result = await ActivityLog.findOne({ user: userId }, 'logs').exec();

        if (!result) {
            throw new Error('User not found');
        }

        const logs = result.logs;

        if (!Array.isArray(logs)) {
            throw new Error('Logs data is not in the expected format');
        }
        console.log(logs)
        res.status(200).json({ logs })

        return logs;
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

exports.Login = async(req, res) => {
    try {
        const { email, password, username } = req.body;
        var loginId;

        if (email) {
            const validateEmail = Emailvalidator.validate(email);
            if (!validateEmail) return res.status(401).json({ message: "Invalid Email" });
            loginId = { email: email };
        } else if (username) {
            loginId = { username: username };
        } else {
            return res.status(400).json({ message: "Invalid request" });
        }

        const User = await user.findOne(loginId).select("+password");
        if (!User) {
            return res.status(404).json({ message: "Invalid username or email" });
        }
        const verifiedPassword = await bcrypt.compare(password, User.password);
        if (!verifiedPassword) {
            return res.status(401).json({ message: "Invalid User Password" });
        }
        await logActivity(User.id, 'email');
        const token = jwt.sign({ id: User.id, authMethod: 'email' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.set('Authorization', token);
        res.status(200).json({ message: "Login successful", token: token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.updateUser = async(req, res) => {
    try {

        const { name, email, username, ethereumAddress } = req.body;
        const User = await user.findOne({ email: email });

        if (!User) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (name !== undefined) {
            User.name = name;
        }
        if (email !== undefined) {
            User.email = email;
        }
        if (username !== undefined) {
            User.username = username;
        }
        if (ethereumAddress !== undefined) {
            User.ethereumAddress = ethereumAddress.toLowerCase();
        }
        await User.save();
        return res.json({ message: 'User data updated successfully', User });
    } catch (error) {
        console.error('Error updating user data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.web3Auth = async(req, res) => {
    const { ethereumAddress, email } = req.body;
    console.log(ethereumAddress)

    try {
        let User = await user.findOne({ ethereumAddress: ethereumAddress }).select("+password")
        if (!User) {
            User = await user.findOne({ email: email }).select("+password")
            User.ethereumAddress = ethereumAddress
            User.save()
        }
        console.log(User)
        await logActivity(User.id, 'web3');
        const token = jwt.sign({ id: User.id, authMethod: 'web3' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.set('Authorization', token);
        res.status(200).json({ message: "Login successful", token: token });
    } catch (error) {
        console.error('Error authenticating with web3:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}