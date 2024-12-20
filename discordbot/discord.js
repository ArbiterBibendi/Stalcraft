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
      const itemName = interaction.options.getString("name", true);
      const minPrice = interaction.options.getNumber("min_price", true);
      const maxPrice = interaction.options.getNumber("max_price", true);
      const rarity = interaction.options.getString("rarity", false);
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
      });
      notificationRule.save();
      await interaction.reply({
        content: `${itemName} ${minPrice} ${maxPrice} ${rarity}`,
        ephemeral: true,
      });
    }
  } else if (interaction.isAutocomplete()) {
    await interaction.respond([{ name: "monday", value: "monday1" }]);
  }
});

client.login(token);
