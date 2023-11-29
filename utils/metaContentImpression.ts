import getUserId from "./getUserId";
import superjson from "superjson";
import { Impression, MetaContentImpression } from "../prisma-client-index";
import logger from "./logger";

declare var BW_DASHBOARD_BASE_URL: string;

export const generateMetaContentImpression = async (
  aid: string,
  mcid: string,
  contentHasScroll: boolean
) => {
  logger.info("in generateImpression with: ", aid, mcid, contentHasScroll);
  const res = await fetch(
    `${BW_DASHBOARD_BASE_URL}/api/metaContentImpressions/generate`,
    {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metaContentId: mcid,
        auctionId: aid,
        userId: getUserId(),
        contentHasScroll,
      }),
      credentials: "include",
    }
  );

  const text = await res.text();
  let data: any = {};
  try {
    data = await superjson.parse<any>(text);
  } catch (err) {
    data = {};
  }
  return data as MetaContentImpression;
};

export const setMetaContentFeedback = async (
  metaContentImpressionId: string,
  feedbackEmoji: string
) => {
  logger.info(
    "in setMetaContentFeedback with: ",
    metaContentImpressionId,
    feedbackEmoji
  );
  const res = await fetch(
    `${BW_DASHBOARD_BASE_URL}/api/metaContentImpressions/setFeedbackEmoji`,
    {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metaContentImpressionId,
        feedbackEmoji,
        userId: getUserId(),
      }),
      credentials: "include",
    }
  );

  const text = await res.text();
  let data: any = {};
  try {
    data = await superjson.parse<any>(text);
  } catch (err) {
    data = {};
  }
  return data as Impression;
};

export const setMetaContentPercentageScrolled = async (
  metaContentImpressionId: string,
  percentageScrolled: number
) => {
  logger.info(
    "in setMetaContentPercentageRead with: ",
    metaContentImpressionId,
    percentageScrolled
  );
  const res = await fetch(
    `${BW_DASHBOARD_BASE_URL}/api/metaContentImpressions/setPercentageScrolled`,
    {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metaContentImpressionId,
        percentageScrolled,
        userId: getUserId(),
      }),
      credentials: "include",
    }
  );

  const text = await res.text();
  let data: any = {};
  try {
    data = await superjson.parse<any>(text);
  } catch (err) {
    data = {};
  }
  return data as Impression;
};
