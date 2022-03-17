const { User } = require("../models");
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')

                return userData;
            }
            throw new AuthenticationError("Not logged in");
        },
        //get all users
        users: async () => {
            return User.find()
                .select('-__v -password')
        },
        // get a user by username
        user: async (parent, { phoneNumber }) => {
            return User.findOne({ phoneNumber })
            .select('-__v -password')
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { phoneNumber, password }) => {
            const user = await User.findOne({ phoneNumber });

            if(!user) {
                throw new AuthenticationError('Incorrect credentials');
            } 

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        }
    }
}

module.exports = resolvers;