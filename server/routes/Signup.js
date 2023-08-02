const express = require("express")
const router = express.Router()
const { createUser, activateAccount } = require("../controllers/signup.js")



router.post("/signup", createUser)
    // router.post("/activate", activateAccount)


module.exports = router