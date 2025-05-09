const { URLSearchParams } = require("url");
const { sleep } = require("./utils");

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
    return { Authorization: `Bearer ${getKeys(endpoint)}` };
  }
};

let rateLimitLimit = 400;
let rateLimitRemaining = 400;
let rateLimitReset = Date.now();
const ourFetch = async (url, endpoint) => {
  if (rateLimitRemaining < 15) {
    console.log(
      `Rate limit exceeded. Waiting ${rateLimitReset - Date.now()} seconds`
    );
    sleep(rateLimitReset - Date.now());
  }
  const response = await fetch(url, {
    headers: getHeaders(endpoint),
    cache: "no-store",
  });
  const body = await response.json();

  for (const entry of response.headers.entries()) {
    if (entry[0] == "x-ratelimit-limit") {
      rateLimitLimit = entry[1];
    } else if (entry[0] == "x-ratelimit-remaining") {
      rateLimitRemaining = entry[1];
    } else if (entry[0] == "x-ratelimit-reset") {
      rateLimitReset = entry[1];
    }
  }
  console.log(
    `Remaining: ${rateLimitRemaining}. Resets in ${
      (rateLimitReset - Date.now()) / 1000
    } seconds.`
  );
  return body;
};

const defaultRegion = regions.NA;
const GetRegions = async () => {
  const full_url = ENDPOINTS.GetRegions.base_url;
  const response = await ourFetch(full_url, ENDPOINTS.GetRegions);
  return response;
};
const GetEmissionStatus = async (region = defaultRegion) => {
  const full_url = ENDPOINTS.GetEmissionStatus.base_url.replace(
    "{region}",
    region
  );
  const response = await ourFetch(full_url, ENDPOINTS.GetEmissionStatus);
  return response;
};
const GetFriends = async (character, region = defaultRegion) => {
  const full_url = ENDPOINTS.GetFriends.base_url
    .replace("{character}", character)
    .replace("{region}", region);
  const response = await ourFetch(full_url, ENDPOINTS.GetFriends);
  return response;
};
const GetAuctionPriceHistory = async (
  itemId,
  region = defaultRegion,
  urlSearchParams = new URLSearchParams()
) => {
  const full_url =
    ENDPOINTS.GetAuctionPriceHistory.base_url
      .replace("{item}", itemId)
      .replace("{region}", region) + `?${urlSearchParams.toString()}`;
  const response = await ourFetch(full_url, ENDPOINTS.GetAuctionPriceHistory);
  return response;
};
const GetAuction = async (
  itemId,
  region = defaultRegion,
  urlSearchParams = new URLSearchParams()
) => {
  const full_url =
    ENDPOINTS.GetAuction.base_url
      .replace("{item}", itemId)
      .replace("{region}", region) + `?${urlSearchParams.toString()}`;
  const response = await ourFetch(full_url, ENDPOINTS.GetAuction);
  return response;
};
const GetCharacterProfile = async (character, region = defaultRegion) => {
  const full_url = ENDPOINTS.GetCharacterProfile.base_url
    .replace("{character}", character)
    .replace("{region}", region);
  const response = await ourFetch(full_url, ENDPOINTS.GetCharacterProfile);
  return response;
};
const GetCharacterList = async (region = defaultRegion) => {
  const full_url = ENDPOINTS.GetCharacterList.base_url.replace(
    "{region}",
    region
  );
  const response = await ourFetch(full_url, ENDPOINTS.GetCharacterList);
  return response;
};
const GetClanInfo = async (clan_id, region = defaultRegion) => {
  const full_url = ENDPOINTS.GetClanInfo.base_url
    .replace("{clan-id}", clan_id)
    .replace("{region}", region);
  const response = await ourFetch(full_url, ENDPOINTS.GetClanInfo);
  return response;
};
const GetClanMembers = async (clan_id, region = defaultRegion) => {
  const full_url = ENDPOINTS.GetClanMembers.base_url
    .replace("{clan-id}", clan_id)
    .replace("{region}", region);
  const response = await ourFetch(full_url, ENDPOINTS.GetClanMembers);
  return response;
};
const GetClanList = async (
  region = defaultRegion,
  urlSearchParams = new URLSearchParams()
) => {
  const full_url =
    ENDPOINTS.GetClanList.base_url.replace("{region}", region) +
    `?${urlSearchParams.toString()}`;
  const response = await ourFetch(full_url, ENDPOINTS.GetClanList);
  return response;
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
