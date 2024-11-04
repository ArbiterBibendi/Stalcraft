require("dotenv").config({ path: "../.env" });

const { Client, Events, GatewayIntentBits } = require("discord.js");
const token = process.env.DISCORD_KEY;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.commandName === "notify") {
        const itemName = interaction.options.getString("name", true);
        const minPrice = interaction.options.getNumber("min_price", true);
        const maxPrice = interaction.options.getNumber("max_price", true);

        const rarity = interaction.options.getString("rarity", false);
        const minLevel = interaction.options.getNumber("min_level", false);
        const maxLevel = interaction.options.getNumber("max_level", false);

        
        await interaction.reply({content: `${itemName} ${minPrice} ${maxPrice} ${rarity}`, ephemeral: true})
    }
});

client.login(token);
