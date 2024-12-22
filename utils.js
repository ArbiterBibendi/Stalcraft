module.exports.filterByQuality = (lots, qlt) => {
  if (qlt == -1) {
    return lots;
  }
  return lots?.filter((lot) => {
    return lot.additional.qlt == qlt;
  });
};
module.exports.getAveragePriceCurrent = (lots) => {
  const totalPrice = lots.reduce((acc, currentVal) => {
    return acc + currentVal.buyoutPrice;
  }, 0);
  return totalPrice / lots.length;
};
module.exports.getAveragePriceHistorical = (prices) => {
  let itemCountExtraFromBulkSale = 0;
  const totalPrice = prices.reduce((acc, currentVal) => {
    itemCountExtraFromBulkSale += currentVal.amount - 1;
    return acc + currentVal.price;
  }, 0);
  return totalPrice / (prices.length + itemCountExtraFromBulkSale);
};
module.exports.rarities = [
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
];
