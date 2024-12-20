require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const token = process.env.DISCORD_KEY;
const clientId = process.env.DISCORD_CLIENTID;
const guild_id = "321200898816868354";
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
    option
      .setName("rarity")
      .setDescription("Item rarity")
      .setChoices([
        //white common, Green Uncommon, blue special, pink rare, red exclusive, yellow legendary
        {
          name: "Common",
          value: 0,
        },
        {
          name: "Uncommon",
          value: 1,
        },
        {
          name: "Special",
          value: 2,
        },
        {
          name: "Rare",
          value: 3,
        },
        {
          name: "Exclusive",
          value: 4,
        },
        {
          name: "Legendary",
          value: 5,
        },
      ])
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
  .setName("deleteAll")
  .setDescription("Delete all currently active notification rules");
try {
  rest
    .put(Routes.applicationGuildCommands(clientId, guild_id), {
      body: [
        notify,
        viewNotifications,
        deleteNotification,
        deleteAllNotifications,
      ],
    })
    .then(() => {
      console.log(notify);
    });
} catch (e) {
  console.log(e);
}
