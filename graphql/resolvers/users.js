const User = require('../../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { validateRegisterInput, validateLoginInput } = require('../util/validators');

const { SECRET_KEY } = require('../../config.js')
function generateToken(user) {
    return jwt.sign({    // save the user to the database
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { 
        expiresIn: '1h'}); // defining the expirationtim
};

module.exports = {
    Mutation: {
        async login(_, {username, password}) {
            const { errors, valid } = validateLoginInput(username, password);

            if(!valid) {
                throw new UserInputError('Errors', {errors})
            }

            const user = await User.findOne({username});
            if(!user) {
                errors.general = "User not found";
                throw new UserInputError('User not found', {errors});
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                errors.general = "Wrong credentials! ";
                throw new UserInputError('Wrong credentials! ', {errors});
            }

            const token = generateToken(user); 

            return {
                ...user._doc,
                id: user._id,
                token
            };
        },

        async register(_, { 
            registerInput: {username, email, password, confirmPassword}
						}, 
            ) {
            // Validate user data, non-empty or wrong fields
            const {valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid){
                throw new UserInputError('Errors', {errors});
            }
            // TODO check for unique username
            // TODO Hash password and create auth token
            const user = await User.findOne({username});
            if(user){
                throw new UserInputError('Username is taken' ,{
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }
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
            const token = generateToken(res); // defining the expirationtime

            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
};
