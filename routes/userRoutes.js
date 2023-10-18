const express = require('express')

const userRoute = express.Router()

const {createUser, getUser, initializeTrans, verifyTrans} = require("../controllers/userController.js")


userRoute.post("/createUser", createUser)
userRoute.post("/transaction/:id", initializeTrans)
userRoute.get("/getUser/:id", getUser);
userRoute.post("/verifytransaction/:id", verifyTrans)

module.exports= userRoute