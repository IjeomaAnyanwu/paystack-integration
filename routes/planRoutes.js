const express = require('express')
const planRoute = express.Router();

const {getPlans, createPlan, addWebhook} = require("../controllers/planController.js")

planRoute.get("/getPlans", getPlans)
planRoute.post("/createPlan", createPlan)
planRoute.post("/paystackWebhook", addWebhook)


module.exports = planRoute
