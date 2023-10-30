import getUserId from "./getUserId";
import { getCleanUrl } from "./url";
import {
  Auction,
  MetaContent,
  MetaContentSpot,
  Setting,
} from "../prisma-client-index";
import superjson from "superjson";
import { AdWithDetail } from "./dom";
import { MetaContentType } from "../data/getMetaContent";
import logger from "./logger";

declare var BW_DASHBOARD_BASE_URL: string;

export type LimitedSettingsType = Pick<
  Setting,
  | "sponsoredWording"
  | "makeLinksBold"
  | "customStyles"
  | "mainPostBodySelector"
  | "metaContentSpotSelector"
  | "metaContentStatus"
  | "metaContentDisplayPercentage"
  | "metaContentMobileDisplayPercentage"
  | "metaContentToolTipTheme"
  | "metaContentToolTipTextColor"
>;

export type MetaContentSpotsWithMetaContentAndType = MetaContentSpot & {
  metaContents: (MetaContent & {
    metaContentType: MetaContentType;
  })[];
};

export type AuctionResponse = {
  auction: Auction;
  adsWithDetail: AdWithDetail[];
  metaContentSpotsWithDetail: MetaContentSpotsWithMetaContentAndType[];
  settings: LimitedSettingsType;
  abortCategoryNames: string[];
  messages: string[];
  optOutCookieValue: boolean;
};

export const generateAuction = async () => {
  const res = await fetch(`${BW_DASHBOARD_BASE_URL}/api/auctions/generate`, {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: getUserId(),
      url: getCleanUrl(window.document.location.href),
      screenWidth: window.screen?.availWidth,
      screenHeight: window.screen?.availHeight,
    }),
    credentials: "include",
  });
  try {
    const text = await res.text();
    const data = await superjson.parse<any>(text);
    logger.info("in generateAuction with data: ", data);
    return data as AuctionResponse;
  } catch (err) {
    return null;
  }
};

export const updateTimeSpent = (aid: string, timeSpent: number) => {
  const body = {
    userId: getUserId(),
    timeSpent,
  };
  const blob = new Blob([JSON.stringify(body)], { type: "application/json" });

  navigator.sendBeacon(
    `${BW_DASHBOARD_BASE_URL}/api/auctions/${aid}/updateTimeSpent`,
    blob
  );
};

export const updateExtra = async (aid: string, extra: string) => {
  const res = await fetch(
    `${BW_DASHBOARD_BASE_URL}/api/auctions/${aid}/updateExtra`,
    {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: getUserId(),
        extra,
      }),
      credentials: "include",
    }
  );
};

export const updateAuction = async (aid: string, data: any) => {
  const res = await fetch(`${BW_DASHBOARD_BASE_URL}/api/auctions/${aid}`, {
    mode: "cors",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
    }),
    credentials: "include",
  });
};
