const express = require("express");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { UserRegisterModel } = require("../models/user.model");

const UserRoute = express.Router();

UserRoute.get("/users", async (req, res) => {
    const allUsers = await UserRegisterModel.find()
    res.status(200).json(allUsers)
})

UserRoute.post("/register", (req, res) => {


    const { name, email, password } = req.body

    bcrypt.hash(password, 7, async (err, hashed) => {


        try {
            const submitData = new UserRegisterModel({ name, email, password: hashed })
            await submitData.save()
            res.status(201).json({ msg: "Signup successful" })
        } catch (error) {
            if (error.code == 11000) {
                res.status(400).json({ result: false, error: error.keyValue, msg: "User Allready exists" })
            }
        }
    })
})


UserRoute.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserRegisterModel.findOne({ email })
        if (user) {
            console.log(user);
            bcrypt.compare(password, user.password, (err, valid) => {
                if (valid) {

                    const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_KEY)
                    // res.cookie("token", `${jwtToken}`, { maxAge: 900000000, secure: true })
                    res.status(200).json({ result: true, msg: "Login successful", token: `Bearer ${jwtToken}` })

                } else {
                    return res.status(500).json({ result: false, msg: "Wrong Password" })

                }



            })
        } else {
            res.status(500).json({ result: false, msg: "User not found" })
        }

    } catch (err) {
        res.status(400).json({ result: false, msg: "Somthing went wrong" })
        console.log(err);
    }
})

UserRoute.post("/users/:id/friends", async (req, res) => {
    const id = req.params.id
    const { user } = req.body
    const isUser = await UserRegisterModel.findById(id)
    if (!isUser) {
        return res.status(500).json({ msg: "User Not found!" })
    }
    try {

        await UserRegisterModel.findByIdAndUpdate({ _id: id }, {
            $push: {
                friendRequests: {
                    _id: user,
                }
            }
        })
        res.status(200).json({ msg: "Request Sent. " })
    } catch (err) {
        res.json(err.message)
    }

})

module.exports = { UserRoute }