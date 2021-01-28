const User = require('../../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../../config.js')

module.exports = {
    Mutation: {
        async register(_, { registerInput: {username, email, password, confirmPassword}}, context, info) {
            // TODO Validate user data, non-empty or wrong fields
            // TODO check for unique username
            // TODO Hash password and create auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });
            
            const res = await newUser.save(); // save the user to the database

            // create new token for the user that takes a payload

            // token to be sent to server i.e. encoded
            const token = jwt.sign({    // save the user to the database
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY, { expiresIn: '1h'}); // defining the expirationtime

            return {
                ...res._doc,
                id: res.id,
                token
            };
        }
    }
};
