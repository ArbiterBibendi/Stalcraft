require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const token = process.env.DISCORD_KEY;
const clientId = process.env.DISCORD_CLIENTID;
const guild_id = "321200898816868354";
const rest = new REST().setToken(token);
const command = new SlashCommandBuilder()
.setName("notify")
.setDescription(
  "Notify user when an item is on auction for a range of prices"
)
.addStringOption((option) =>
  option.setName("name").setDescription("Name of item").setRequired(true).setAutocomplete(true)
)
.addNumberOption((option) =>
  option.setName("min_price").setDescription("Minimum price").setRequired(true)
)
.addNumberOption((option) =>
  option.setName("max_price").setDescription("Maximum price").setRequired(true)
)
.addStringOption((option) => 
    option.setName("rarity").setDescription("Item rarity").setChoices([ //white common, Green Uncommon, blue special, pink rare, red exclusive, yellow legendary
      {
        name: "Common",
        value: "common",
      },
      {
        name: "Uncommon",
        value: "uncommon"
      },
      {
        name: "Special",
        value: "special"
      },
      {
        name: "Rare",
        value: "rare"
      },
      {
        name: "Exclusive",
        value: "exclusive"
      },
      {
        name: "Legendary",
        value: "legendary"
      },
    ])
)
.addNumberOption((option) => 
    option.setName("min_level").setDescription("Item's minimum upgrade level")
)
.addNumberOption((option) => 
    option.setName("max_level").setDescription("Item's maximum upgrade level")
)
try {
  rest.put(Routes.applicationGuildCommands(clientId, guild_id), {
    body: [
        command,
    ],
  }).then(() => {
    console.log(command);
  });
} catch(e) {
    console.log(e);
}
