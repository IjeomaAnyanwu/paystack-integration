const User = require("../models/userModel.js");
const dotenv = require("dotenv");

dotenv.config();
const paystack = require("paystack-api")(process.env.SECRET);

const createUser = async (req, res) => {
  let { email, fullname } = req.body;

  const user = new User({
    fullname,
    email,
  });
  await user.save();

  res.status(201).send({
    data: user,
    message: "User created successfully",
    status: 0,
  });
};

const getUser = async (req, res) => {
  try {
    let { id } = req.params;
    const user = await User.findById(id);

    res.status(200).send({
      user,
      message: "Found user Details",
      status: 0,
    });
  } catch (err) {
    res.status(500).send({ data: {}, error: err.message, status: 1 });
  }
};
const initializeTrans = async (req, res) => {
  try {
    let { id } = req.params;
    const { email, amount, plan } = req.body;

    const response = await paystack.transaction.initialize({
      email,
      amount,
      plan,
    });

    const data = {
      paystack_ref: response.data.reference,
    };

    await User.findByIdAndUpdate(id, data);
    res.status(200).send({
      data: response.data,
      message: response.message,
      status: response.status,
    });
  } catch (error) {
    res.status(400).send({ data: {}, error: `${error.message}`, status: 1 });
  }
};

const verifyTrans = async (req, res) => {
  try {
    let { id } = req.params;

    const user = await User.findById(id);

    if (user.paystack_ref === "success")
      return res.status(201).send({
        data: {},
        message: "Transaction has been verified",
        status: 1,
      });

    const response = await paystack.transaction.verify({
      reference: user.paystack_ref,
    });

    if (response.data.status == "success") {
      const data = {
        paystack_ref: response.data.status,
        amountDonated: response.data.amount,
      };
      await User.findByIdAndUpdate(id, data);

      return res.status(200).send({
        data: response.data,
        message: response.message,
        status: response.status,
      });
    } else {
      return res.status(200).send({
        data: response.data,
        message: response.message,
        status: response.status,
      });
    }
  } catch (error) {
    res.status(400).send({ data: {}, error: `${error.message}`, status: 1 });
    console.log(error);
  }
};

module.exports = {
  createUser,
  getUser,
  initializeTrans,
  verifyTrans,
};
