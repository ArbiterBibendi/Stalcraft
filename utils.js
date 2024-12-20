module.exports.filterByQuality = (lots, qlt) => {
    if (qlt == -1) {
        return lots;
    }
    return lots?.filter((lot) => {
        return lot.additional.qlt == qlt;
    });
}
module.exports.getAveragePriceCurrent = (lots) => {
    const totalPrice = lots.reduce((acc, currentVal) => {
        return acc + currentVal.buyoutPrice;
    }, 0);
    return totalPrice / lots.length;
}
module.exports.getAveragePriceHistorical = (prices) => {
    let itemCountExtraFromBulkSale = 0;
    const totalPrice = prices.reduce((acc, currentVal) => {
        itemCountExtraFromBulkSale += currentVal.amount - 1;
        return acc + currentVal.price;
    }, 0);
    return totalPrice / (prices.length + itemCountExtraFromBulkSale);
}