const { Schema } = require("mongoose");

const setupDb = async () => {
  const { MongoClient } = require("mongodb");

  const mongoURL = "mongodb://localhost:27017";
  const mongoClient = new MongoClient(mongoURL);
  await mongoClient.connect();
  const db = mongoClient.db("StalcraftTools");
  return db;
};
const notificationRuleSchema = new Schema({
  itemID: {
    type: String,
    required: true,
  },
  minPrice: {
    type: Number,
    required: true,
  },
  maxPrice: {
    type: Number,
    required: true,
  },
  rarity: Number,
  minLevel: Number,
  maxLevel: Number,
  oneShot: Boolean,
  itemName: {
    type: String,
    required: true,
  },
  notifyUser: String,
  notifyRole: String,
});
const channelSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
});

module.exports.setupDb = setupDb;
module.exports.notificationRuleSchema = notificationRuleSchema;
module.exports.channelSchema = channelSchema;
