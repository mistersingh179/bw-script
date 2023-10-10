import getUserId from "./getUserId";
import superjson from "superjson";
import { Impression, MetaContentImpression } from "../prisma-client-index";
import logger from "./logger";

declare var BW_DASHBOARD_BASE_URL: string;

export const generateMetaContentImpression = async (
  aid: string,
  mcid: string
) => {
  logger.info("in generateImpression with: ", aid, mcid);
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
      }),
      credentials: "include",
    }
  );

  const text = await res.text();
  const data = await superjson.parse<any>(text);
  logger.info("genereated MetaContentImpression: ", data);
  return data as MetaContentImpression;
};

export const setMetaContentFeedback = async (
  metaContentImpressionId: string,
  feedbackEmoji: string
) => {
  logger.info("in setMetaContentFeedback with: ", metaContentImpressionId, feedbackEmoji);
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
  const data = await superjson.parse<any>(text);
  return data as Impression;
};
