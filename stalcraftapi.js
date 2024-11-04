const { URLSearchParams } = require("url");

require("dotenv").config();
const ENDPOINTS = {
  GetRegions: {
    base_url: "https://dapi.stalcraft.net/regions",
    auth_type: "application",
  },
  GetEmissionStatus: {
    base_url: "https://dapi.stalcraft.net/{region}/emission",
    auth_type: "application",
  },
  GetFriends: {
    base_url: "https://dapi.stalcraft.net/{region}/friends/{character}",
    auth_type: "user",
  },
  GetAuction: {
    base_url: "https://dapi.stalcraft.net/{region}/auction/{item}/history",
    auth_type: "application",
  },
  GetAuction: {
    base_url: "https://dapi.stalcraft.net/{region}/auction/{item}/lots",
    auth_type: "application",
  },
  GetCharacterProfile: {
    base_url:
      "https://dapi.stalcraft.net/{region}/character/by-name/{character}/profile",
    auth_type: "application",
  },
  GetCharacterList: {
    base_url: "https://dapi.stalcraft.net/{region}/characters",
    auth_type: "user",
  },
  GetClanInfo: {
    base_url: "https://dapi.stalcraft.net/{region}/clan/{clan-id}/info",
    auth_type: "application",
  },
  GetClanMembers: {
    base_url: "https://dapi.stalcraft.net/{region}/clan/{clan-id}/members",
    auth_type: "user",
  },
  GetClanList: {
    base_url: "https://dapi.stalcraft.net/{region}/clans",
    auth_type: "application",
  },
};

const regions = {
  NA: "NA",
  RU: "RU",
  EU: "EU",
  SEA: "SEA",
};
const getKey = (endpoint) => {
  const isApplication = endpoint.auth_type === "application";
  return isApplication ? process.env.APPLICATION_KEY : process.env.USER_KEY;
};
const defaultRegion = regions.NA;
const GetRegions = async () => {
  const endpoint = ENDPOINTS.GetRegions.base_url;
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${getKey(ENDPOINTS.GetRegions)}` },
  });
  const body = await response.json();
  return body;
};
const GetEmissionStatus = async (region = defaultRegion) => {
  const endpoint = ENDPOINTS.GetEmissionStatus.base_url.replace(
    "{region}",
    region
  );
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${getKey(ENDPOINTS.GetEmissionStatus)}` },
  });
  const body = await response.json();
  return body;
};
const GetFriends = async (character, region = defaultRegion) => {
  const endpoint = ENDPOINTS.GetFriends.base_url
    .replace("{character}", character)
    .replace("{region}", region);
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${getKey(ENDPOINTS.GetFriends)}` },
  });
  const body = await response.json();
  return body;
};
const GetAuctionPriceHistory = async (
  itemId,
  region = defaultRegion,
  urlSearchParams = new URLSearchParams()
) => {
  const endpoint =
    ENDPOINTS.GetAuctionPriceHistory.base_url
      .replace("{item}", itemId)
      .replace("{region}", region) + `?${urlSearchParams.toString()}`;
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${getKey(ENDPOINTS.GetAuctionPriceHistory)}`,
    },
  });
  const body = await response.json();
  return body;
};
const GetAuction = async (
  itemId,
  region = defaultRegion,
  urlSearchParams = new URLSearchParams()
) => {
  const endpoint =
    ENDPOINTS.GetAuction.base_url
      .replace("{item}", itemId)
      .replace("{region}", region) + `?${urlSearchParams.toString()}`;
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${getKey(ENDPOINTS.GetAuction)}` },
  });
  const body = await response.json();
  return body;
};
const GetCharacterProfile = async (character, region = defaultRegion) => {
  const endpoint = ENDPOINTS.GetCharacterProfile.base_url
    .replace("{character}", character)
    .replace("{region}", region);
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${getKey(ENDPOINTS.GetCharacterProfile)}`,
    },
  });
  const body = await response.json();
  return body;
};
const GetCharacterList = async (region = defaultRegion) => {
  const endpoint = ENDPOINTS.GetCharacterList.base_url.replace(
    "{region}",
    region
  );
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${getKey(ENDPOINTS.GetCharacterList)}` },
  });
  const body = await response.json();
  return body;
};
const GetClanInfo = async (clan_id, region = defaultRegion) => {
  const endpoint = ENDPOINTS.GetClanInfo.base_url
    .replace("{clan-id}", clan_id)
    .replace("{region}", region);
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${getKey(ENDPOINTS.GetClanInfo)}` },
  });
  const body = await response.json();
  return body;
};
const GetClanMembers = async (clan_id, region = defaultRegion) => {
  const endpoint = ENDPOINTS.GetClanMembers.base_url
    .replace("{clan-id}", clan_id)
    .replace("{region}", region);
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${getKey(ENDPOINTS.GetClanMembers)}` },
  });
  const body = await response.json();
  return body;
};
const GetClanList = async (
  region = defaultRegion,
  urlSearchParams = new URLSearchParams()
) => {
  const endpoint =
    ENDPOINTS.GetClanList.base_url.replace("{region}", region) +
    `?${urlSearchParams.toString()}`;
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${getKey(ENDPOINTS.GetClanList)}` },
  });
  const body = await response.json();
  return body;
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
