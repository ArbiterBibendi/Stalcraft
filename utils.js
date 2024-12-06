module.exports.filterByQuality = (lots, qlt) => {
    if (qlt == -1) {
        return lots;
    }
    return lots.filter((lot) => {
        return lot.additional.qlt == qlt;
    });
}
module.exports.getAveragePrice = (lots) => {
    const totalPrice = lots.reduce((acc, currentVal) => {
        return acc + currentVal.buyoutPrice;
    }, 0);
    return totalPrice / lots.length;
}