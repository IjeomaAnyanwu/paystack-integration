
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String
    },
    email: {
        type: mongoose.Schema.Types.Mixed,
    },
    paystack_ref:{
        type: String
    },
    amountDonated:{
        type:Number
    },
    isSubscribed: {
        type: Boolean
    },
    planName: {
        type:String
    },
    timeSubscribed: {
        type: Date
    }
});

const User =mongoose.model('user', userSchema)

module.exports = User;























const { MongoClient, ObjectId } = require("mongodb");
const moment = require("moment");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const convertDateStringsToDateObjects = (dateString) => {
  const dateObject = moment(dateString, "DD/MM/YYYY").format("YYYY-MM-DD");

  return dateObject;
};

const {
  mongodb: { url },
} = require("./config");

const dbName = "kezaV2-prod";
const collectionName = "billingactivitytrails";

const run = async (option) => {
  if (option.toLowerCase() !== "yes") {
    readline.question(`Do you want to run the update [Yes to proceed]?`, run);
    return;
  }

  try {
    const client = new MongoClient(url, { useNewUrlParser: true });

    await client.connect();

    const db = client.db(dbName);
    const model = db.collection(collectionName);

    const bulk = model.initializeUnorderedBulkOp();

    const results = await model.find({}).lean().exec();

    await results.forEach((row) => {
      console.log({ row: new ObjectId(row._id) });
      bulk.find({ _id: new ObjectId(row._id) }).update({
        $set: {
          parseDueDate: new Date(convertDateStringsToDateObjects(row.dueDate)),
        },
      });
    });

    const bulkRes = await bulk.execute();

    await client.close();

    readline.close();

    console.log("DONE");
    console.log(bulkRes);

    return "Done updating";
  } catch (error) {
    console.error("Error:", error);
  }
};

readline.question(
  `Proceed to updating all dueDate [Enter Yes to proceed]?`,
  run
);