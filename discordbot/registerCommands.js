require("dotenv").config();
const rarities = require("../utils").rarities;
const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const token = process.env.DISCORD_KEY;
const clientId = process.env.DISCORD_CLIENTID;
const guild_id = "1319758702504312964"; //"321200898816868354";
const rest = new REST().setToken(token);
const notify = new SlashCommandBuilder()
  .setName("notify")
  .setDescription("Notify user when an item is on auction in a range of prices")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Name of item")
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addNumberOption((option) =>
    option
      .setName("min_price")
      .setDescription("Minimum price")
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("max_price")
      .setDescription("Maximum price")
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option.setName("rarity").setDescription("Item rarity").setChoices(rarities)
  )
  .addNumberOption((option) =>
    option.setName("min_level").setDescription("Item's minimum upgrade level")
  )
  .addNumberOption((option) =>
    option.setName("max_level").setDescription("Item's maximum upgrade level")
  )
  .addBooleanOption((option) =>
    option.setName("one_shot").setDescription("Notify once and remove rule")
  );

const viewNotifications = new SlashCommandBuilder()
  .setName("view")
  .setDescription("View all currently active notification rules");
const deleteNotification = new SlashCommandBuilder()
  .setName("delete")
  .setDescription("Delete notification rule to stop being notified")
  .addStringOption((option) => {
    return option
      .setName("notification_id")
      .setDescription("ID of the notification you would like to delete");
  });
const deleteAllNotifications = new SlashCommandBuilder()
  .setName("delete_all")
  .setDescription("Delete all currently active notification rules");
const setChannel = new SlashCommandBuilder()
  .setName("set_channel")
  .setDescription("Sets the channel that notifications will be posted in")
  .addChannelOption((option) => {
    return option.setName("channel").setDescription("The channel");
  });
const priceHistory = new SlashCommandBuilder()
  .setName("price_history")
  .setDescription("Show price history of an item")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Name of item")
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addStringOption((option) =>
    option
      .setName("chart_type")
      .setDescription("Type of chart")
      .setChoices([
        { name: "Line", value: "line" },
        { name: "Scatter", value: "scatter" },
      ])
  );
try {
  rest
    .put(Routes.applicationGuildCommands(clientId, guild_id), {
      body: [
        notify,
        viewNotifications,
        deleteNotification,
        deleteAllNotifications,
        setChannel,
        priceHistory,
      ],
    })
    .then(() => {
      console.log(notify);
    });
} catch (e) {
  console.log(e);
}
