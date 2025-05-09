const globalItemDbPath = "./itemdb/global/";
const itemListings = require(`${globalItemDbPath}/listing.json`);

const findItemByName = (name) => {
  const listings = itemListings.filter((listing) => {
    return name.toLowerCase() == getEnglishName(listing).toLowerCase();
  });
  if (listings.length < 1) {
    console.log(`Could not find item by the name of ${name}`);
    return null;
  }
  const item = require(`${globalItemDbPath}${listings[0].data}`);
  return item;
};
const getItemIdByName = (name) => {
  const item = findItemByName(name);
  if (!item) {
    return "0";
  }
  return item.id;
};
const getEnglishName = (item) => {
  return item.name.type === "translation" ? item.name.lines.en : item.name.text;
};
const getItemId = (item) => {
  const arr = item.data.split(".")[0].split("/");
  return arr[arr.length - 1];
};
const ItemCategories = {
  Armor: "armor",
  Artefact: "artefact",
  Attachment: "attachment",
  Bullet: "bullet",
  Containers: "containers",
  Drink: "drink",
  Food: "food",
  Grenade: "grenade",
  Medicine: "medicine",
  Misc: "misc",
  Other: "other",
  Weapon: "weapon",
};
const getItemsOfType = (category) => {
  const listings = itemListings.filter((listing) => {
    const listingCategory = listing.data.split("/")[2];
    return listingCategory == category;
  });
  return listings;
};
const getItems = () => {
  const listings = itemListings;
  return listings;
};

module.exports.findItemByName = findItemByName;
module.exports.getItemIdByName = getItemIdByName;
module.exports.getEnglishName = getEnglishName;
module.exports.getItemsOfType = getItemsOfType;
module.exports.getItems = getItems;
module.exports.ItemCategories = ItemCategories;
module.exports.getItemId = getItemId;
