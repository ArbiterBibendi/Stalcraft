const { URLSearchParams } = require("url");

require("dotenv").config();
const env = process.env.ENVIRONMENT;
const getUrl = (environment) => {
  return environment == "prod"
    ? "https://eapi.stalcraft.net"
    : "https://dapi.stalcraft.net";
};
const ENDPOINTS = {
  GetRegions: {
    base_url: getUrl(env) + "/regions",
    auth_type: "application",
  },
  GetEmissionStatus: {
    base_url: getUrl(env) + "/{region}/emission",
    auth_type: "application",
  },
  GetFriends: {
    base_url: getUrl(env) + "/{region}/friends/{character}",
    auth_type: "user",
  },
  GetAuctionPriceHistory: {
    base_url: getUrl(env) + "/{region}/auction/{item}/history",
    auth_type: "application",
  },
  GetAuction: {
    base_url: getUrl(env) + "/{region}/auction/{item}/lots",
    auth_type: "application",
  },
  GetCharacterProfile: {
    base_url: getUrl(env) + "/{region}/character/by-name/{character}/profile",
    auth_type: "application",
  },
  GetCharacterList: {
    base_url: getUrl(env) + "/{region}/characters",
    auth_type: "user",
  },
  GetClanInfo: {
    base_url: getUrl(env) + "/{region}/clan/{clan-id}/info",
    auth_type: "application",
  },
  GetClanMembers: {
    base_url: getUrl(env) + "/{region}/clan/{clan-id}/members",
    auth_type: "user",
  },
  GetClanList: {
    base_url: getUrl(env) + "/{region}/clans",
    auth_type: "application",
  },
};

const regions = {
  NA: "NA",
  RU: "RU",
  EU: "EU",
  SEA: "SEA",
};
const getKeys = (endpoint) => {
  const isApplication = endpoint.auth_type === "application";
  const applicationKey =
    process.env.ENVIRONMENT == "prod"
      ? process.env.APPLICATION_KEY
      : process.env.DEMO_APPLICATION_KEY;
  const userKey =
    process.env.ENVIRONMENT == "prod"
      ? process.env.USER_KEY
      : process.env.DEMO_USER_KEY;
  return isApplication ? applicationKey : userKey;
};
const getHeaders = (endpoint) => {
  if (env == "prod") {
    return {
      "Client-Id": process.env.CLIENT_ID,
      "Client-Secret": process.env.CLIENT_SECRET,
    };
  } else {
    return { Authorization: `Bearer ${getKey(endpoint)}` };
  }
};
const defaultRegion = regions.NA;
const GetRegions = async () => {
  const endpoint = ENDPOINTS.GetRegions.base_url;
  const response = await fetch(endpoint, {
    headers: getHeaders(ENDPOINTS.GetRegions),
    cache: "no-store",
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
    headers: getHeaders(ENDPOINTS.GetEmissionStatus),
    cache: "no-store",
  });
  const body = await response.json();
  return body;
};
const GetFriends = async (character, region = defaultRegion) => {
  const endpoint = ENDPOINTS.GetFriends.base_url
    .replace("{character}", character)
    .replace("{region}", region);
  const response = await fetch(endpoint, {
    headers: getHeaders(ENDPOINTS.GetFriends),
    cache: "no-store",
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
    headers: getHeaders(ENDPOINTS.GetAuctionPriceHistory),
    cache: "no-store",
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
    headers: getHeaders(ENDPOINTS.GetAuction),
    cache: "no-store",
  });
  const body = await response.json();
  return body;
};
const GetCharacterProfile = async (character, region = defaultRegion) => {
  const endpoint = ENDPOINTS.GetCharacterProfile.base_url
    .replace("{character}", character)
    .replace("{region}", region);
  const response = await fetch(endpoint, {
    headers: getHeaders(ENDPOINTS.GetCharacterProfile),
    cache: "no-store",
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
    headers: getHeaders(ENDPOINTS.GetCharacterList),
    cache: "no-store",
  });
  const body = await response.json();
  return body;
};
const GetClanInfo = async (clan_id, region = defaultRegion) => {
  const endpoint = ENDPOINTS.GetClanInfo.base_url
    .replace("{clan-id}", clan_id)
    .replace("{region}", region);
  const response = await fetch(endpoint, {
    headers: getHeaders(ENDPOINTS.GetClanInfo),
    cache: "no-store",
  });
  const body = await response.json();
  return body;
};
const GetClanMembers = async (clan_id, region = defaultRegion) => {
  const endpoint = ENDPOINTS.GetClanMembers.base_url
    .replace("{clan-id}", clan_id)
    .replace("{region}", region);
  const response = await fetch(endpoint, {
    headers: getHeaders(ENDPOINTS.GetClanMembers),
    cache: "no-store",
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
    headers: getHeaders(ENDPOINTS.GetClanList),
    cache: "no-store",
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
