const itemdb = require("./itemdb");
const api = require('./stalcraftapi');

const main = async () => {
    console.log(await api.GetAuction(itemdb.getItemIdByName("Acid Crystal"), undefined, new URLSearchParams({
        additional: true,
        limit: 1,
        sort: "buyout_price"
    })));
}
main();