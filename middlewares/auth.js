const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const SECRET_KEY = "whdnwdiu9euq9peuq089289883239";


const auth = async (req, res, next) => {
    try {
        // decrypt the token
        const authHeader = req.headers.authorization;
        //console.log(req.headers);
        //console.log(authHeader);
        //Bearer token
        const token = authHeader.split("Bearer ")[1];
        //console.log(token);
        const username = await jwt.verify(token, SECRET_KEY);
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(400).json({ error: "Token invalid" });
        }

        res.locals.user = user;

        return next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Token not present"});
    }
}

module.exports = auth;