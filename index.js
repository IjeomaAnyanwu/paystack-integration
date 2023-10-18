const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes.js");
const planRoute = require("./routes/planRoutes.js");
const ngrok = require("@ngrok/ngrok");

dotenv.config();

const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", userRoute);
app.use("/plans", planRoute);

//routes

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} node on port ${PORT}`);
});

if (process.env.NODE_ENV == "development") {
  (async function () {
    const url = await ngrok.connect({
      addr: PORT,
      authtoken_from_env: true,
      authtoken: process.env.NGROK_AUTHTOKEN,
    });
    console.log(`Ingress established at : ${url}`);
  })();
}
