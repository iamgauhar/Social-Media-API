const express = require("express")
const { connectDB } = require("./config/db")
const cors = require("cors")
const { UserRoute } = require("./routes/user.route")
const { PostRoute } = require("./routes/post.route")
const app = express()

app.use(cors({
    origin: "*",
}))

app.use(express.json())
app.use("/api", UserRoute)
app.use("/api/posts", PostRoute)

app.get("/", (req, res) => {
    res.send("Social media API")
})

app.listen(5000, async () => {
    try {
        await connectDB
        console.log("Connected DB on 5000");
    } catch (err) {
        console.log(err);
    }
})