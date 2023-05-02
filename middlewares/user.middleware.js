const jwt = require("jsonwebtoken")
require("dotenv").config()


const authorization = (req, res, next) => {
    // console.log(req.headers?.authorization);
    if (req.headers?.authorization) {
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
            if (decode) {
                // console.log(decode)

                const userId = decode.id
                req.body.user = userId

                next()
            } else {
                res.send("Please Login invalid token")
            }
        })


    } else {
        res.send("Please Login")
    }
}

module.exports = { authorization }