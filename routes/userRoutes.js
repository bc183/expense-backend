const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const SECRET_KEY = "whdnwdiu9euq9peuq089289883239";

const router = express.Router();

const register = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword,username } = req.body;

    let errors = {};

    // required validation

    if (username.trim().length === 0) {
        errors.username = "Username cannot be empty";
    }

    if (email.trim().length === 0) {
        errors.email = "email cannot be empty";
    }

    if (password.trim().length === 0) {
        errors.password = "Password cannot be empty";
    }

    if (confirmPassword.trim().length === 0) {
        errors.confirmPassword = "Confirm Password cannot be empty";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    //other validation

    if (password !== confirmPassword) {
        errors.error = "Password and Confirm Password do not match";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    //unique username validation
    try {
        const user = await User.findOne({ username: username });

        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        //hash password;

        const hashedPassword = await bcrypt.hash(password, 6);

        //save the user in the db
        let userObj = new User({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        });

        const savedUser = await userObj.save();
        return res.status(201).json(savedUser);
    } catch(error) {
        console.log(error);
        return res.status(400).json({ error: "Something went wrong!" });
    }


}

const login = async (req, res) => {
    const { username, password } = req.body;

    let errors = {};

    // required validation

    if (username.trim().length === 0) {
        errors.username = "Username cannot be empty";
    }

    if (password.trim().length === 0) {
        errors.password = "Password cannot be empty";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    //check user exists.
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({ error: "Username/Password is incorrect."});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Username/Password is incorrect."});
        }

        //generate token
        const token = jwt.sign(username, SECRET_KEY);
        console.log(token);
        return res.status(200).json({ token: token, user: { username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, createdAt: user.createdAt} });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong"});
    }
}

router.post("/register", register);
router.post("/login", login);

module.exports = router;