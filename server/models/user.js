const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    ethereumAddress: {
        type: String,
        unique: true
    },
    ppImage: {
        type: String,
    },
    authMethod: {
        type: String,
        enum: ['email', 'web3'],
        default: 'email'
    }, // Current authentication method
    lastLogin: {
        type: Date
    }, // Last login timestamp
    activityLogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivityLog'
    }],
    role: {
        type: String,
        default: "user"
    },
    Token: {},
    resetToken: {},
    expireToken: {},

}, { timestamps: true });

module.exports = mongoose.model("user", userSchema)