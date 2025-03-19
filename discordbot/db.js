const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const connectToDb = async () => {
  return await mongoose.connect("mongodb://localhost:27017/StalcraftTools");
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

const notificationRuleModel = mongoose.model(
  "NotificationRule",
  notificationRuleSchema
);
const channelModel = mongoose.model("Channel", channelSchema);

module.exports.connectToDb = connectToDb;
module.exports.notificationRuleModel = notificationRuleModel;
module.exports.channelModel = channelModel;
