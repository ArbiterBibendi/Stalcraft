require("dotenv").config();

const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");
const token = process.env.DISCORD_KEY;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rarities = require("../utils").rarities;

const mongoose = require("mongoose");
const { notificationRuleSchema, channelSchema } = require("./db");
const NotificationRulesModel = mongoose.model(
  "NotificationRule",
  notificationRuleSchema
);
const ChannelModel = mongoose.model("Channel", channelSchema);

const itemdb = require("../itemdb");
const api = require("../stalcraftapi");

const getRarityName = (rarities, filteredLot) => {
  const filteredRarities = rarities.filter((rarity) => {
    return rarity.value == filteredLot.additional.qlt;
  });
  if (!filteredRarities) {
    return "";
  }
  if (filteredRarities[0] == undefined) {
    return "Unknown";
  }

  return filteredRarities[0].name;
};
const notifiedLots = [];
const checkForItems = async () => {
  const channelDoc = await ChannelModel.find({});
  if (!channelDoc || channelDoc[0] == undefined) {
    return;
  }
  const channelId = channelDoc[0].id;
  const channel = await client.channels.fetch(channelId);
  const notificationRules = await NotificationRulesModel.find({});
  if (notificationRules.length < 1) {
    return;
  }
  notificationRules.forEach(async (notificationRule) => {
    let finalMessage = "";
    try {
      const response = await api.GetAuction(
        itemdb.getItemIdByName(notificationRule.itemName),
        undefined,
        new URLSearchParams({
          additional: true,
          limit: 200,
          sort: "buyout_price",
          order: "asc",
        })
      );
      const filteredLots = response.lots.filter((lot) => {
        const inPriceRange =
          lot.buyoutPrice >= notificationRule.minPrice &&
          lot.buyoutPrice <= notificationRule.maxPrice;
        const inLevelRange =
          notificationRule.minLevel && notificationRule.maxLevel
            ? lot.additional.upgrade_bonus >= notificationRule.minLevel &&
              lot.additional.upgrade_bonus <= notificationRule.maxLevel
            : true;
        const matchesRarity = notificationRule.rarity
          ? notificationRule.rarity == lot.additional.qlt
          : true;
        return inPriceRange && inLevelRange && matchesRarity;
      });

      filteredLots.forEach(async (filteredLot) => {
        let found = false;
        notifiedLots.forEach(async (notifiedLot) => {
          if (JSON.stringify(notifiedLot) == JSON.stringify(filteredLot)) {
            found = true;
            return;
          }
        });
        if (!found) {
          // add the lot to the final message if is unique for this session
          console.log(notificationRule.notifyRole);
          const user = notificationRule.notifyUser
            ? notificationRule.notifyUser
            : "";
          const role = notificationRule.notifyRole
            ? notificationRule.notifyRole
            : "";
          const item = `Item: **${String(
            notificationRule.itemName.charAt(0).toUpperCase() +
              notificationRule.itemName.slice(1)
          )}**`;
          const rarityName = getRarityName(rarities, filteredLot);
          const rarity =
            rarityName != "Unknown" ? `Rarity: **${rarityName}**` : "";
          finalMessage += user;
          finalMessage += role;
          finalMessage += item;
          finalMessage += rarity;
          finalMessage += `  Buyout Price: **${filteredLot.buyoutPrice}**\r\n`;
          notifiedLots.push(filteredLot);
        }
      });
    } catch (e) {
      console.error(e);
    }
    if (finalMessage) {
      await channel.send(finalMessage);
    }
  });
};
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
  await mongoose.connect("mongodb://localhost:27017/StalcraftTools");
  // start routine to automatically check all notification rules in the db and notify if there are any items fitting the rules
  // maybe store already notified items in the db until either:
  //                                                     the notification listing that it is associated with is deleted
  //                                                     the item is bought, or falls off of the auction house

  try {
    await checkForItems();
    const intervalId = setInterval(checkForItems, 2500);
  } catch (e) {
    console.error(e);
  }
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
      const oneShot = interaction.options.getBoolean("one_shot", false);
      const notifyUser = interaction.options.getUser("notify_user");
      const notifyRole = interaction.options.getRole("notify_role");

      const itemID = itemdb.getItemIdByName(itemName);
      if (itemID == 0) {
        await interaction.reply({
          content: `Could not find item with name ${itemName}`,
        });
        console.error("No item named " + itemName);
        return;
      }
      const notificationRule = new NotificationRulesModel({
        itemID,
        minPrice,
        maxPrice,
        rarity,
        minLevel,
        maxLevel,
        oneShot,
        itemName,
        notifyUser,
        notifyRole,
      });
      if (!notificationRule.itemID) {
        await interaction.reply({
          content: `No item could be found with the name ${notificationRules.itemName}`,
          ephemeral: true,
        });
        return;
      }
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
        content: notificationRules
          .reduce((acc, notificationRule) => {
            acc += `**${notificationRule._id}**: 
          **Item:**  ${notificationRule.itemName}
          **ID:**  ${notificationRule.itemID}
          **min:**  ${notificationRule.minPrice} 
          **max:**  ${notificationRule.maxPrice} 
          \r\n`;
            return acc;
          }, "")
          .slice(0, 2000),
        ephemeral: true,
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
        console.error(e);
        await interaction.reply({
          content: `Someting wong`,
          ephemeral: true,
        });
      }
    } else if (interaction.commandName === "delete_all") {
      try {
        await NotificationRulesModel.deleteMany({});
        await interaction.reply({
          content: `Successfully removed all notification rules`,
          ephemeral: true,
        });
      } catch (e) {
        await interaction.reply({
          content: `Someting wong`,
          ephemeral: true,
        });
      }
    } else if (interaction.commandName === "set_channel") {
      await ChannelModel.deleteMany({});
      const channel = interaction.options.getChannel("channel");
      const channelDoc = new ChannelModel({
        id: channel.id,
      });
      try {
        channelDoc.save();
        interaction.reply({
          content: "Channel saved!",
          ephemeral: true,
        });
      } catch (e) {
        interaction.reply({
          content: "UH OH. U H H OH OUH OH BUH OH UH OHUH OHUH HOH UH !!!",
          ephemeral: true,
        });
      }
    } else if (interaction.commandName === "price_history") {
      let chartType = interaction.options.getString("chart_type");
      if (chartType == null) {
        chartType = "line";
      }
      const itemName = interaction.options.getString("name", true);
      const itemID = itemdb.getItemIdByName(itemName);

      if (itemID == 0) {
        await interaction.reply({
          content: `Could not find item with name ${itemName}`,
        });
        console.error("No item named " + itemName);
        return;
      }
      const priceHistory = await api.GetAuctionPriceHistory(itemID);
      const prices = priceHistory.prices;
      const priceData = prices.map((history) => {
        return {
          x: history.time,
          y: history.price / history.amount,
        };
      });
      const chart = {
        type: chartType,
        data: {
          datasets: [
            {
              fontColor: "green",
              label: `${itemName}s`,
              fill: false,
              data: priceData,
              lineTension: 0.2,
              pointBorderColor: "red",
              fontColor: "#14213d",
            },
          ],
        },
        options: {
          scales: {
            xAxes: [
              {
                type: "time",
                ticks: {
                  fontColor: "#14213d",
                  fontSize: 14,
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: "#14213d",
                  fontSize: 14,
                },
              },
            ],
          },
        },
      };
      console.log(prices);
      await interaction.reply({
        content: `https://quickchart.io/chart?c=${encodeURIComponent(
          JSON.stringify(chart)
        )}&backgroundColor=${encodeURIComponent("rgb(242, 229, 88)")}`,
      });
    }
  } else if (interaction.isAutocomplete()) {
    const allItemNames = require("../itemdb/global/listing.json").map(
      (item) => {
        return item.name.lines.en;
      }
    );
    const filteredItemNames = allItemNames.filter((itemName) => {
      return itemName
        .toLowerCase()
        .includes(interaction.options.getFocused(false).toLowerCase());
    });
    try {
      await interaction.respond(
        filteredItemNames
          .map((itemName) => {
            1;
            return {
              name: itemName,
              value: itemName,
            };
          })
          .slice(0, 24)
      );
    } catch (e) {
      console.log(e);
      await interaction.respond([{ name: "Error ", value: e.message }]);
    }
  }
});

client.login(token);
