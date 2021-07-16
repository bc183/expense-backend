const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    createdAt: {
        type: Date
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;