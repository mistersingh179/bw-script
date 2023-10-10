import { AdWithDetail } from "./dom";
import getUserId from "./getUserId";
import { getCleanUrl } from "./url";
import superjson from "superjson";
import { Auction, Impression } from "../prisma-client-index";
import logger from "./logger";

declare var BW_DASHBOARD_BASE_URL: string;

export const generateImpression = async (
  auction: Auction,
  ad: AdWithDetail
) => {
  logger.info("in generateImpression with: ", ad);
  const res = await fetch(`${BW_DASHBOARD_BASE_URL}/api/impressions/generate`, {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      advertisementId: ad.id,
      auctionId: auction.id,
      userId: getUserId(),
    }),
    credentials: "include",
  });

  const text = await res.text();
  const data = await superjson.parse<any>(text);
  return data as Impression;
};

export const markImpressionClicked = async (impression: Impression) => {
  logger.info("in markImpressionClicked with: ", impression);
  const res = await fetch(
    `${BW_DASHBOARD_BASE_URL}/api/impressions/markClicked`,
    {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        impressionId: impression.id,
        userId: getUserId(),
      }),
      credentials: "include",
    }
  );

  const text = await res.text();
  const data = await superjson.parse<any>(text);
  return data as Impression;
};
