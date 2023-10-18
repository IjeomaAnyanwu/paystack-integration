const dotenv = require("dotenv");
dotenv.config();

const paystack = require("paystack-api")(process.env.SECRET);
const {
  planChargeSuccess,
  chargeSuccess,
  cancelSubscription,
} = require("../helpers/webHookHelpers.js");

const createPlan = async (req, res) => {
  try {
    const { interval, name, amount } = req.body;
    const response = await paystack.plan.create({
      name,
      amount,
      interval,
    });
    res.status(200).send({
      data: response.data,
      message: response.message,
      status: response.status,
    });
  } catch (error) {
    res.status(400).send({ data: {}, error: `${error.message}`, status: 1 });
  }
};

const getPlans = async (req, res) => {
  try {
    const response = await paystack.plan.list();

    res.status(200).send({
      data: response.data,
      message: response.message,
      status: response.status,
    });
  } catch (error) {
    res.status(400).send({ data: {}, error: `${error.message}`, status: 1 });
  }
};

const addWebhook = async (req, res) => {
  try {
    let data = req.body;
    console.log("webhook data: ", data);

    switch (data) {
      case (data.event = "invoice.payment_failed"):
        await cancelSubscription(data);
        console.log("Invoice Failed");
        break;
      case (data.event = "Invoice.create"):
        console.log("invoice created");
        break;
      case (data.event = "Invoice.update"):
        data.data.status == "success"
          ? await planChargeSuccess(data)
          : console.log("Update Failed");
        break;
      case (data.event = "subscription.not_renew"):
        console.log("unrenewed");
        break;
      case (data.event = "subscription.disable"):
        console.log("disabled");
      case (data.event = "transfer.success"):
        console.log("transfer successful");
        break;
      case (data.event = "transfer.failed"):
        console.log("transfer failed");
        break;
      case (data.event = "transfer.reversed"):
        console.log("transfer reversed");
        break;
      case (data.event = "subscription.disable"):
        console.log("disabled");
        break;

      default:
        //successful charge
        const obj = data.data.plan;
        console.log("implementing charges logic...");

        Object.keys(obj).length === 0 && obj.constructor === Object
          ? await chargeSuccess(data)
          : await planChargeSuccess(data);
        console.log("Successful");
        break;
    }
  } catch (error) {
    res.status(400).send({
      data: {},
      error: `${error.message}`,
      status: 1,
    });
  }
};

module.exports = {
  createPlan,
  getPlans,
  addWebhook,
};
