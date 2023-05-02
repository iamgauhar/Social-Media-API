const mongooose = require("mongoose")

const UserRegisterModel = mongooose.model("user", mongooose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    dob: {
        type: Date
    },
    bio: {
        type: String,
    },
    posts: [{ postID: String }],
    friends: [{ friendID: String }],
    friendRequests: [{ friendID: String }]

}))



module.exports = { UserRegisterModel }