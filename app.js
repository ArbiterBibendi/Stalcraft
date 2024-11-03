const itemdb = require("./itemdb");
const api = require('./stalcraftapi');

const main = async () => {
    console.log(await api.GetRegions());
}
main();