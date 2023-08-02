const express = require("express")
const router = express.Router()
const { Login, getUserDetails, web3Auth, getLogsByUserId, updateUser } = require("../controllers/Login")
const { verifyToken } = require("../middleware/validator")

router.post("/login", Login)
router.post("/login/web3Auth", web3Auth)
router.get("/user", verifyToken, getUserDetails)
router.get("/getLogs", verifyToken, getLogsByUserId)
router.put("/updateUser", updateUser)

module.exports = router