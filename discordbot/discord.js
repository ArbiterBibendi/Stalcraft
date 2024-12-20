require("dotenv").config();

const { Client, Events, GatewayIntentBits } = require("discord.js");
const token = process.env.DISCORD_KEY;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const mongoose = require("mongoose");
const { notificationRuleSchema } = require("./db");
const NotificationRulesModel = mongoose.model(
  "NotificationRule",
  notificationRuleSchema
);

const itemdb = require("../itemdb");

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
  await mongoose.connect("mongodb://localhost:27017/StalcraftTools");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === "notify") {
      const itemName = interaction.options
        .getString("name", true)
        .toLowerCase();
      const minPrice = interaction.options.getNumber("min_price", true);
      const maxPrice = interaction.options.getNumber("max_price", true);
      const rarity = interaction.options.getNumber("rarity", false);
      const minLevel = interaction.options.getNumber("min_level", false);
      const maxLevel = interaction.options.getNumber("max_level", false);
      const oneShot = interaction.options.getBoolean("OneShot", false);

      const notificationRule = new NotificationRulesModel({
        itemID: itemdb.getItemIdByName(itemName),
        minPrice,
        maxPrice,
        rarity: Number(rarity),
        minLevel,
        maxLevel,
        oneShot,
        itemName,
      });
      notificationRule.save();
      await interaction.reply({
        content: `${itemName} ${minPrice} ${maxPrice} ${rarity}`,
        ephemeral: true,
      });
    } else if (interaction.commandName === "view") {
      const notificationRules = await NotificationRulesModel.find({});
      if (notificationRules.length < 1) {
        await interaction.reply({
          content:
            "No notification rules currently exist. You can create one with the `/notify` command",
          ephemeral: true,
        });
        return;
      }
      await interaction.reply({
        content: notificationRules.reduce((acc, notificationRule) => {
          acc += `**${notificationRule._id}**: 
          **Item:**  ${notificationRule.itemName}
          **ItemID:**  ${notificationRule.itemID}
          **minPrice:**  ${notificationRule.minPrice} 
          **maxPrice:**  ${notificationRule.maxPrice} 
          **rarity:**  ${notificationRule.rarity} 
          **minLevel:**  ${notificationRule.minLevel} 
          **maxLevel:**  ${notificationRule.maxLevel} 
          **oneShot:**  ${notificationRule.oneShot}
          \r\n`;
          return acc;
        }, ""),
      });
    } else if (interaction.commandName === "delete") {
      const id = interaction.options.getString("notification_id", true);
      if (!id) {
        await interaction.reply({
          content: `No id supplied! This cannot work!`,
          ephemeral: true,
        });
      }
      try {
        await NotificationRulesModel.findByIdAndDelete(id);
        await interaction.reply({
          content: `Successfully removed notification rule`,
          ephemeral: true,
        });
      } catch (e) {
        await interaction.reply({
          content: `Someting wong`,
          ephemeral: true,
        });
      }
    }
  } else if (interaction.isAutocomplete()) {
    await interaction.respond([{ name: "monday", value: "monday1" }]);
  }
});

client.login(token);
