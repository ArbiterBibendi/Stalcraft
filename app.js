const itemdb = require("./itemdb");
const api = require("./stalcraftapi");
const utils = require("./utils");

const main = async () => {
  const response = await api.GetAuction(
    itemdb.getItemIdByName("Rattle"),
    undefined,
    new URLSearchParams({
      additional: true,
      limit: 200,
      sort: "buyout_price",
      order: "asc",
    })
  );
  console.log(utils.filterByQuality(response.lots, 2));
};
main();
