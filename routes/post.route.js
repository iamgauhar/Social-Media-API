const express = require("express")
const { authorization } = require("../middlewares/user.middleware")
const { PostModel } = require("../models/post.model")
const { UserRegisterModel } = require("../models/user.model")
const PostRoute = express.Router()

PostRoute.get("/", async (req, res) => {
    const allPosts = await PostModel.find()
    res.status(200).json(allPosts)
})
PostRoute.get("/:id", async (req, res) => {
    const allPosts = await PostModel.findById(req.params.id)
    res.status(200).json(allPosts)
})

PostRoute.post("/", authorization, async (req, res) => {
    const { user, text, image } = req.body

    // console.log(thisUser);
    try {
        const post = new PostModel({
            user,
            text,
            image,
            createdAt: new Date()
        })

        await post.save()
        const { id } = post
        await UserRegisterModel.findByIdAndUpdate({ _id: user }, {
            $push: {
                posts: {
                    id
                }
            }
        })
        res.status(200).json({ msg: "Post created" })
    } catch (err) {
        res.json(err.message)
    }
})

PostRoute.patch("/:id", async (req, res) => {
    try {
        await PostModel.findByIdAndUpdate({ _id: req.params.id }, req.body)
        res.status(200).json({ msg: "post updated successfully" })
    } catch (error) {
        res.json(err.message)
    }
})

PostRoute.delete("/:id", async (req, res) => {
    try {
        await PostModel.findByIdAndDelete({ _id: req.params.id })
        res.status(200).json({ msg: "post Deleyed successfully" })
    } catch (error) {
        res.json(err.message)
    }
})

PostRoute.post("/:id/like", authorization, async (req, res) => {
    const id = req.params.id
    const { user } = req.body

    try {

        await PostModel.findByIdAndUpdate({ _id: id }, {
            $push: {
                likes: {
                    _id: user
                }
            }
        })
        res.status(200).json({ msg: "Post Likes" })
    } catch (err) {
        res.json(err.message)
    }
})

PostRoute.post("/:id/comment", authorization, async (req, res) => {
    const id = req.params.id
    const { user, text } = req.body

    try {

        await PostModel.findByIdAndUpdate({ _id: id }, {
            $push: {
                comments: {
                    _id: user,
                    text,
                    createdAt: new Date()
                }
            }
        })
        res.status(200).json({ msg: "Comment Posted " })
    } catch (err) {
        res.json(err.message)
    }
})

module.exports = { PostRoute }