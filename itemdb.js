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

module.exports.findItemByName = findItemByName;
module.exports.getItemIdByName = getItemIdByName;
module.exports.getEnglishName = getEnglishName;
