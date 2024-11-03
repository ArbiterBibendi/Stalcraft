const ENDPOINTS = [
  "https://eapi.stalcraft.net/regions",
  "https://eapi.stalcraft.net/{region}/emission",
  "https://eapi.stalcraft.net/{region}/friends/{character}",
  "https://eapi.stalcraft.net/{region}/auction/{item}/history",
  "https://eapi.stalcraft.net/{region}/auction/{item}/lots",
  "https://eapi.stalcraft.net/{region}/character/by-name/{character}/profile",
  "https://eapi.stalcraft.net/{region}/characters",
  "https://eapi.stalcraft.net/{region}/clan/{clan-id}/info",
  "https://eapi.stalcraft.net/{region}/clan/{clan-id}/members",
  "https://eapi.stalcraft.net/{region}/clans",
];
const regions = {
  NA: "NA",
  RU: "RU",
  EU: "EU",
  SEA: "SEA",
};
const defaultRegion = regions.NA;
const api_key = process.env.API_KEY;
const GetRegions = async () => {
  const endpoint = `https://eapi.stalcraft.net/regions`;
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${api_key}` },
  });
  const body = await response.json();
  return body;
};
const GetEmissionStatus = async (region = defaultRegion) => {
  const endpoint = `https://eapi.stalcraft.net/${region}/emission`;
};
const GetFriends = async (character, region = defaultRegion) => {
  const endpoint = `https://eapi.stalcraft.net/${region}/friends/${character}`;
};
const GetAuctionPriceHistory = async (item, region = defaultRegion) => {
  const endpoint = `https://eapi.stalcraft.net/${region}/auction/${item}/history`;
};
const GetAuction = async (item, region = defaultRegion) => {
  const endpoint = `https://eapi.stalcraft.net/${region}/auction/${item}/lots`;
};
const GetCharacterProfile = async (character, region = defaultRegion) => {
  const endpoint = `https://eapi.stalcraft.net/${region}/character/by-name/${character}/profile`;
};
const GetCharacterList = async (region = defaultRegion) => {
  const endpoint = `https://eapi.stalcraft.net/${region}/characters`;
};
const GetClanInfo = async (clan_id, region = defaultRegion) => {
  const endpoint = `https://eapi.stalcraft.net/${region}/clan/${clan_id}/info`;
};
const GetClanMembers = async (clan_id, region = defaultRegion) => {
  const endpoint = `https://eapi.stalcraft.net/${region}/clan/${clan_id}/members`;
};
const GetClanList = async (region = defaultRegion) => {
  const endpoint = `https://eapi.stalcraft.net/${region}/clans`;
};

module.exports.GetRegions = GetRegions;
module.exports.GetEmissionStatus = GetEmissionStatus;
module.exports.GetFriends = GetFriends;
module.exports.GetAuctionPriceHistory = GetAuctionPriceHistory;
module.exports.GetAuction = GetAuction;
module.exports.GetCharacterProfile = GetCharacterProfile;
module.exports.GetCharacterList = GetCharacterList;
module.exports.GetClanInfo = GetClanInfo;
module.exports.GetClanMembers = GetClanMembers;
module.exports.GetClanList = GetClanList;
