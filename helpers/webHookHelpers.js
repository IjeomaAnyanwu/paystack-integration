const dotenv = require("dotenv");
const User = require("../models/userModel.js");
const { response } = require("express");
dotenv.config();
const paystack = require("paystack-api")(process.env.SECRET);

const chargeSuccess = async (res, req) => {
  try {
    const output = data.data;
    const reference = output.reference;
    console.log(output)

    const user = await User.findOne({ paystack_ref: reference });
    const userId = user._id;
    console.log("updating charge status");

    if (user.paystack_ref === "success")
      return {
        data: {},
        message: "Transaction has been verified",
        status: 1,
      };

    const response = await paystack.transaction.verify({
      reference: user.paystack_ref,
    });

    if (response.data.status == "success") {
      const data = {
        paystack_ref: response.data.status,
        amountDonated: output.amount,
      };
      await User.findByIdAndUpdate(userId, data);
      console.log("charge Successful");
    } else {
      console.log("charge Unsuccessful");
    }
  } catch (err) {
    console.log({
      data: {},
      error: `${error.message}`,
      status: 1,
    });
  }
};

// successful subscription

const planChargeSuccess = async (data) => {
  try {
    const output = data.data;
    const reference = output.reference;
    console.log(output);

    const user = await user.findOne({ paystack_ref: reference });
    const userId = user._id;
    console.log(user, reference);
    console.log("updating charge status");

    //subscribe for user
    if (user.paystack_ref == "success")
      return {
        data: {},
        message: "Transaction has been verified",
        status: 1,
      };

    const response = await paystack.transaction.verify({
      reference: user.paystack_ref,
    });

    if (response.data.status == "success") {
      await User.findByIdAndUpdate(userId, {
        isSubscribed: true,
        paystack_ref: response.data.status,
        planName: output.plan.name,
        timeSubscribed: response.data.paid_at,
      });
      console.log("charge Successful");
    } else {
      console.log("charge Unsuccessful");
    }
  } catch (error) {
    console.log({ data: {}, error: `${error.message}`, status: 1 });
  }
};

//invoicePaymentFailed

const cancelSubscription = async (data) => {
  try {
    const output = data.data;
    const reference = output.reference;
    console.log(output)

    const user = await User.findOne({ paystack_ref: reference });
    const userId = user._id;

    console.log("Canceling Subscription ...");

    await User.findByIdAndUpdate(userId, {
      isSubscribed: true,
      paystack_ref: response.data.status,
      planName: "cancelled",
    });
    console.log("User Subscription cancelled");
  } catch (error) {
    console.log({
      data: {},
      error: `${error.message}`,
      status: 1,
    });
  }
};

module.exports = {
  planChargeSuccess,
  chargeSuccess,
  cancelSubscription,
};
